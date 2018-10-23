'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var bannerManagementSchema = new Schema({
    BannerId: { type: Number, required: true },
    Name: { type: String, required: true },
    IsActive: { type: Boolean, deafult: true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    UpdatedOn: { type: Date, default: Date.now },
    UpdatedBy: { type: String, default: '' },
}, { collection: 'BannerManagement' });

autoIncrement.initialize(mongoose.connection);
bannerManagementSchema.plugin(autoIncrement.plugin, {
    model: 'BannerManagement', field: 'BannerId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('BannerManagement', bannerManagementSchema);