'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
	CityId: { type: Number },
	CityName: { type: String }
}, { collection: 'City' });

var City = mongoose.model('City', CitySchema);
var CityArray = [{ CityId: 1, CityName: "All" },
{ CityId: 2, CityName: "Ahemadabad" },
{ CityId: 3, CityName: "Adipur" },
{ CityId: 4, CityName: "Airoli" },
{ CityId: 5, CityName: "Aklera" },
{ CityId: 6, CityName: "Ambaji" },
{ CityId: 7, CityName: "Ambapur" }];

City.find({}, function (err, data) {
	if (err)
		return console.error(err);
	if (data == '') {
		City.collection.insert(CityArray, function (err, docs) {
			if (err) {
				return console.error(err);
			}
		});
	}
})

module.exports = mongoose.model('City', CitySchema);