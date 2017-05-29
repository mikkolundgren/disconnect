var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playhistorySchema = new Schema({
    albumId: String,
    playDate: { type: Date, default: Date.now }
});

var Playhistory = module.exports = mongoose.model('Playhistory', priceSchema);

module.exports.createPlayhistory = function(newPlayhistory, callback) {
    newPlayhistory.save(callback);
}

module.exports.findPlayhistoryByAlbumId = function(albumId, callback) {

    Playhistory.
        find({albumId: albumId}).
        where('albumId').equals(albumId).
        sort('+playDate').
        exec(callback);
}