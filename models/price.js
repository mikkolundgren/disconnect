var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var priceSchema = new Schema({
    albumId: String,
    title: String,
    artist: String,
    year: Number,
    price: Number,
    priceDate: { type: Date, default: Date.now }
});

var Price = module.exports = mongoose.model('Price', priceSchema);

module.exports.createPrice = function(newPrice, callback) {
    newPrice.save(callback);
}

module.exports.findPricesByAlbumId = function(albumId, callback) {
    Price.
        find({albumId: albumId}).
        where('albumId').equals(albumId).
        sort('+priceDate').
        exec(callback);
}
