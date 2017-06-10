var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

var Price = require('../models/price');
var Release = require('../models/release');

var Playhistory = require('../models/playhistory');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

router.get('/', ensureAuthenticated, function(req, res){
    var sort = req.query.sort || "+artist";
    getCollection(sort, function(data) {
        req.flash('success_msg', "Collection size: " + data.releases.length);
        res.render('collection', { user : req.user, data : data });    
    });
    
});

router.get('/played/:albumId', ensureAuthenticated, function(req, res) {
    var albumId = req.params.albumId;
    var playhistory = new Playhistory({
        albumId: albumId
    });

    Playhistory.createPlayhistory(playhistory, function (err, history) {
        if (err) throw err;   
    });
    req.flash('success_msg', 'Added playhistory.');
    res.redirect('/collection');
});

router.post('/search', ensureAuthenticated, function(req, res) {
    var query = req.body.q || "";
    getCollectionByArtistName(query, function(data) {
        req.flash('success_msg', "Found results: " + data.releases.length);
        res.render('collection', { user : req.user, data : data }); 
    });
});

function getCollection(sort, callback) {
    var list = {};
    Release.findReleases(sort, function(err, data) {
        if (err) throw err;
        for (var i in data) {
            data[i].formattedDate = dateFormat(data[i].dateAdded, "dd.mm.yyyy");
        }

        list.releases = data;
        callback(list);
    });
}

function getCollectionByArtistName(query, callback) {
    var list = {};
    Release.findReleasesByArtist(query, function(err, data) {
        if (err) throw err;
        for (var i in data) {
            data[i].formattedDate = dateFormat(data[i].dateAdded, "dd.mm.yyyy");
        }

        list.releases = data;
        callback(list); 
    });
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;