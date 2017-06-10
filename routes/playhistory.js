var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Playhistory = require('../models/playhistory');


router.get('/:albumId', function(req, res) {

    Playhistory.findPlayhistoryByAlbumId(req.params.albumId, function(err, history) {
        if (err) console.log(err);
        var data = formatData(history);
        console.log("%j", data);
        res.render('playhistory', { user : req.user, data : data });        
    });
});

router.get('/delete/:id', function(req, res) {
    Playhistory.findPlayhistoryAndRemoveById(req.params.id, function(err, history) {
        if (err) console.log(err);
        console.log("History deleted: " + history._id);
        res.redirect('/collection');
    });
});

function formatData(history) {
    var ret = [];
    for (var i in history) {   
        var d = dateFormat(history[i].playDate,"dd.mm.yyyy");
        ret.push({id: history[i]._id, albumId : history[i].albumId, playDate: d});
    }
    return ret;
}

module.exports = router;