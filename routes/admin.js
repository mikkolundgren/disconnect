var express = require('express');
var router = express.Router();
var Discogs = require('disconnect').Client;

var Price = require('../models/price');
var Release = require('../models/release');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

var col = new Discogs().user().collection();
var db = new Discogs().database();

var async = require('async');

router.get('/', function(req, res){
    res.render('admin', { user : req.user });
});

router.get('/reloadcollection', ensureAuthenticated, function(req, res) {
    loadCollection(function(data) {
        for (var i in data.releases) {
            createBaseRelease(data.releases[i]);
        }
    });
    req.flash('success_msg', 'Collection loaded.');
    res.render('admin', { user : req.user }); 
});

router.get('/updateprice/:albumId', ensureAuthenticated, function(req, res) {
    var albumId = req.params.albumId;
    console.log("Updating price: " + albumId);
    loadRelease(albumId, function(release) {
        createPrice(release);
    });
    res.redirect('/prices/' + albumId);
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

function loadCollection (callback) {
        col.getReleases('mikko.lundgren', 0, {page: 1, per_page: 50, sort: 'added', sort_order: 'desc'}, function(err, data) { 
            if (err) console.log(err);
            console.log("col fetched from dg: %j", data);
            callback(data);
        });
}

function loadRelease(albumId, callback) {
    console.log("Getting release with id: " + albumId);
    db.getRelease(albumId, function(err, data) {
        if (err) {
          console.log(err);
        } 
        callback(data);
    });
}

function createBaseRelease(release) {
    console.log("Creating base release: ", release.id);

    var newRelease = new Release({
        _id: release.id,
        albumId: release.id,
        title: release.basic_information.title,
        artist: release.basic_information.artists[0].name,
        year: release.basic_information.year,
        dateAdded: release.date_added,
        coverImage: release.basic_information.cover_image
    });

    Release.createRelease(newRelease, function(err, release){
        if (err) console.log(err);
    }); 

}

function createRelease(release) {
    
    console.log("Creating release: ", release.id);

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
        if (err) console.log(err);
    }); 
}

function createPrice(release) {
    if (!release || release == undefined) return;
    console.log("Creating price: ", release.id);
    var newPrice = new Price({
        albumId: release.id,
        title: release.title,
        artist: release.artists[0].name,
        year: release.year,
        price: release.lowest_price,
        priceData: Date.now
    });

    Price.createPrice(newPrice, function(err, price){
        if(err) console.log(err);
        //console.log(price);
    });
}

module.exports = router;