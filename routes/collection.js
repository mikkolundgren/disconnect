var express = require('express');
var router = express.Router();
var Discogs = require('disconnect').Client;
var dateFormat = require('dateformat');

var Price = require('../models/price');
var Release = require('../models/release');

const NodeCache = require('node-cache');
const myCache = new NodeCache();

var col = new Discogs().user().collection();
var db = new Discogs().database();

router.get('/', ensureAuthenticated, function(req, res){
    var sort = req.query.sort || "+artist";
    getCollection(sort, function(data) {
        res.render('collection', { user : req.user, data : data });    
    });
    
});

function getCollection(sort, callback) {
    var list = {};
    Release.findReleases(sort, function(err, data) {
        if (err) throw err;

        for (var i in data) {
            var formattedDate = dateFormat(data[i].dateAdded, "dd.mm.yyyy");
            data[i].formattedDate = formattedDate;
        }

        list.releases = data;

        console.log(list);
        callback(list);
    });
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/auth/login');
    }
}

module.exports = router;