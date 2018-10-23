'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var AdvertisementTypeSchema = new Schema({
    AdvertisementTypeId: { type: Number },
    AdvertisementType: { type: String }
}, { collection: 'AdvertisementType' });

var AdvertisementType = mongoose.model('AdvertisementType', AdvertisementTypeSchema);
var TypeArray = [{ AdvertisementTypeId: 1, AdvertisementType: "Advertising and media" },
{ AdvertisementTypeId: 2, AdvertisementType: "Information and technology" },
{ AdvertisementTypeId: 3, AdvertisementType: "Real estate and construction material" },
{ AdvertisementTypeId: 4, AdvertisementType: "Other" }
];

AdvertisementType.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        AdvertisementType.collection.insert(TypeArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
})
module.exports = mongoose.model('AdvertisementType', AdvertisementTypeSchema);