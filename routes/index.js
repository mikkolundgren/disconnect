var express = require('express');
var router = express.Router();
var Release = require('../models/release');
var Playhistory = require('../models/playhistory');
var Price = require('../models/price');


// Get Homepage
router.get('/', function(req, res){
    if (req.isAuthenticated) {
        const promises = [];
        var dashboard = {};
        const recentlyAddedP = Release.findRecentlyAdded(10, function(data){
            promises.push(recentlyAddedP);
            dashboard.recentlyAdded = data;
        })

        const recentlyPlayedP = Playhistory.findRecentlyPlayed(10, function(data) {
            promises.push(recentlyPlayedP);
            dashboard.recentlyPlayed = data;
        })

        const recentPricesP = Price.findLatestPrices(10, function(data) {
            promises.push(recentPricesP);
            dashboard.recentPrices = data;
        })

        Promise.all(promises);

        res.render('dashboard', { user: req.user, dashboard: dashboard});
    }
    res.render('index', { user : req.user });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;