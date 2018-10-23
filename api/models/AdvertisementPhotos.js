'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var AdvertisementPhotoSchema = new Schema({
    AdvertisementPhotoId: { type: Number },
    AdvertisementId: { type: Number, required: true },
    FileName: { type: String, default: '' },
    FilePath: { type: String, default: '' },
    FileNameInFolder: { type: String, default: '' },
    AdvertisementLocation: { type: Number, required: true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' }
}, { collection: 'AdvertisementPhotos' });
autoIncrement.initialize(mongoose.connection);
AdvertisementPhotoSchema.plugin(autoIncrement.plugin, {
    model: 'AdvertisementPhotos', field: 'AdvertisementPhotoId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('AdvertisementPhotos', AdvertisementPhotoSchema);
//# sourceMappingURL=AdvertisementPhotos.js.map