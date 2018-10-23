'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var advertisementSchema = new Schema({
    AdvertisementId: { type: Number, required: true },
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    IsActive: { type: Boolean, deafult: true },
    StartDate: { type: String, default: '' },
    EndDate: { type: String, default: '' },
    AdvertisementAmountType: { type: String, default: '', required: true },
    Amount: { type: String, default: '' },
    AdvertisementType: { type: Number, required: true },
    AdvertisementLocation: { type: Number,required:true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    UpdatedOn: { type: Date, default: Date.now },
    UpdatedBy: { type: String, default: '' },
}, { collection: 'Advertisement' });

autoIncrement.initialize(mongoose.connection);
advertisementSchema.plugin(autoIncrement.plugin, {
    model: 'Advertisement', field: 'AdvertisementId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('Advertisement', advertisementSchema);