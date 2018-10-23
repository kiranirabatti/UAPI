'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var BannerPhotoSchema = new Schema({
    BannerPhotoId: { type: Number, required: true},
    BannerId: { type: Number, required: true },
    FileName: { type: String, default: '' },
    FilePath: { type: String, default: '' },
    FileNameInFolder: { type: String, default: '' },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' }
}, { collection: 'BannerPhoto' });

autoIncrement.initialize(mongoose.connection);
BannerPhotoSchema.plugin(autoIncrement.plugin, {
    model: 'BannerPhoto', field: 'BannerPhotoId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('BannerPhoto', BannerPhotoSchema);