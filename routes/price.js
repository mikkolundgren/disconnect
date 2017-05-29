var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

var Price = require('../models/price');

var Highcharts = require('highcharts');
//require('highcharts/modules/exporting')(Highcharts);

const NodeCache = require('node-cache');
const myCache = new NodeCache();

var priceData = {};

router.get('/:albumId', function(req, res) {
    Price.findPricesByAlbumId(req.params.albumId, function(err, prices) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log("price: %j", prices );
        formatData(prices);
        console.log(priceData);
        res.render('price', { user : req.user, priceData : priceData });
    });
});

function formatData(prices) {
    
    priceData.title = prices[0].title;
    priceData.artist = prices[0].artist;
    var p_arr = [];
    var d_arr = [];
    for (var p in prices) {
        p_arr.push(prices[p].price);

        d_arr.push("'" + dateFormat(prices[p].priceDate, "dd.mm.yy") + "'");
    }
    priceData.prices = p_arr;
    priceData.dates = d_arr;
}

module.exports = router;