var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

var Price = require('../models/price');

var Highcharts = require('highcharts');
//require('highcharts/modules/exporting')(Highcharts);

const NodeCache = require('node-cache');
const myCache = new NodeCache();



router.get('/:albumId', function(req, res) {
    var albumId = req.params.albumId;
    Price.findPricesByAlbumId(albumId, function(err, prices) {
        if (err) {
            console.log(err);
        }
        
        var priceData = formatData(prices);
        priceData.albumId = albumId;
        console.log(priceData);
        res.render('price', { user : req.user, priceData : priceData });
    });
});

function formatData(prices) {
    console.log(prices);
    var priceData = {};
    if (!prices || prices.length == 0) return priceData;

    priceData.title = prices[0].title;
    priceData.artist = prices[0].artist;
    priceData.albumId = prices[0].albumId;
    var p_arr = [];
    var d_arr = [];
    for (var p in prices) {
        p_arr.push(prices[p].price);

        d_arr.push("'" + dateFormat(prices[p].priceDate, "dd.mm.yy") + "'");
    }
    priceData.prices = p_arr;
    priceData.dates = d_arr;
    return priceData;
}

module.exports = router;