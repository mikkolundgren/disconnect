var express = require('express');
var router = express.Router();
var Discogs = require('disconnect').Client;

var Price = require('../models/price');
var Release = require('../models/release');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

var col = new Discogs().user().collection();
var db = new Discogs().database();

router.get('/', function(req, res){
    res.render('admin', { user : req.user });
});

router.get('/reloadcollection', ensureAuthenticated, function(req, res) {

    loadCollection(function(data) {
        var releases = data.releases;
        for (var i in releases) {
            var dateAdded = releases[i].date_added;
            var coverImage = releases[i].basic_information.cover_image;
            loadRelease(releases[i].id, dateAdded, coverImage, function(release) {
                createRelease(release);
            });    
            var waitTime = new Date(new Date().getTime() + 2 * 1000);
            while (waitTime > new Date()) {}
        }
    });
    res.render('admin', { user : req.user });
});

router.get('/reloadprices', ensureAuthenticated, function(req, res){
    console.log("Reloading prices...");
    Release.findReleases("+artist", function(err, data) {
        if(err) throw err;
        console.log("data: %j", data);
        for (var i in data) {
            var albumId = data[i].albumId;
            console.log("albumId: " + albumId);
            loadRelease(albumId, "", "", function(release) {
                createPrice(release);    
            });
            var waitTime = new Date(new Date().getTime() + 2 * 1000);
            while (waitTime > new Date()) {}
        }    
    });
    res.render('admin', { user : req.user });
    
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/auth/login');
    }
}

function loadCollection (callback) {
        col.getReleases('mikko.lundgren', 0, {page: 1, per_page: 10}, function(err, data) { 
            if (err) throw err;
            console.log("col fetched from dg: %j", data);
            callback(data);
        });
}

function loadRelease(albumId, dateAdded, coverImage, callback) {
    console.log("Getting release with id: " + albumId);
    db.getRelease(albumId, function(err, data) {
        if (err) {
          console.log(err);
          return;
        } 
        data.dateAdded = dateAdded;
        data.coverImage = coverImage;
        callback(data);
    });
}

function createRelease(release) {
    var newRelease = new Release({
        _id: release.id,
        albumId: release.id,
        title: release.title,
        artist: release.artists[0].name,
        year: release.year,
        dateAdded: release.dateAdded,
        coverImage: release.coverImage,
        styles: release.styles,
        genres: release.genres
    });

    Release.createRelease(newRelease, function(err, release){
        if (err) throw err;
    }); 
}

function createPrice(release) {
    //console.log("Rel: %j", release);
    if (!release || release == undefined) return;
    var newPrice = new Price({
        albumId: release.id,
        title: release.title,
        artist: release.artists[0].name,
        year: release.year,
        price: release.lowest_price,
        priceData: Date.now
    });

    Price.createPrice(newPrice, function(err, price){
        if(err) throw err;
        console.log(price);
    });
}

module.exports = router;