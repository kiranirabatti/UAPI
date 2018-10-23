'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var AdvertisementLocationSchema = new Schema({
    AdvertisementLocationId: { type: Number },
    AdvertisementLocation: { type: String },
    AdvertisementSize: { type: String }
}, { collection: 'AdvertisementLocation' });

var AdvertisementLocation = mongoose.model('AdvertisementLocation', AdvertisementLocationSchema);
var LocationArray = [{ AdvertisementLocationId: 1, AdvertisementLocation: "Left side", AdvertisementSize:"320 x 600" },
    { AdvertisementLocationId: 2, AdvertisementLocation: "Right side", AdvertisementSize: "320 x 300" },
    { AdvertisementLocationId: 3, AdvertisementLocation: "Visiting card", AdvertisementSize: "320 x 182" },
];

AdvertisementLocation.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        AdvertisementLocation.collection.insert(LocationArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
})
module.exports = mongoose.model('AdvertisementLocation', AdvertisementLocationSchema);