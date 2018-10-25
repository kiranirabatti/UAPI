'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var eventPhotoSchema = new Schema({
    EventPhotoId: { type: Number,required:true },
    EventId: { type: Number, required: true },
    FileName: { type: String, default: ''},
    FilePath: { type: String, default: ''},
    FileNameInFolder: { type: String, default: ''},
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String,default:'' }
}, { collection: 'EventPhotos' });

autoIncrement.initialize(mongoose.connection);
eventPhotoSchema.plugin(autoIncrement.plugin, {
    model: 'EventPhotos', field: 'EventPhotoId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('EventPhotos', eventPhotoSchema);