var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var releaseSchema = new Schema({
    albumId: {type: String, index:true},
    title: String,
    artist: String,
    year: Number,
    coverImage: String,
    dateAdded: Date,
    styles: Array,
    genres: Array
});

var Release = module.exports = mongoose.model('Release', releaseSchema);

module.exports.createRelease = function(newRelease, callback) {
    var query = {albumId: newRelease.albumId};
    Release.findOneAndUpdate(query, newRelease, {upsert:true}, callback);
}

module.exports.findReleases = function(sort, callback) {
    Release.
        find().
        sort(sort).
        exec(callback);
}

module.exports.findReleasesByArtist = function(q, callback) {
    var query = {artist: new RegExp(q, 'i')};
    Release.
        find(query).
        sort('+artist').
        exec(callback);
}