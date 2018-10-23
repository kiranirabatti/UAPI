'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var EducationSchema = new Schema({
    EducationId: { type: Number },
    Description: { type: String }
}, { collection: 'Education' });

var education = mongoose.model('Education', EducationSchema);
var educationArray = [{ EducationId: 1, Description: "All" },
    { EducationId: 2, Description: "10th" },
    { EducationId: 3, Description: "12th" },
    { EducationId: 4, Description: "BE" },
    { EducationId: 5, Description: "BA" },
    { EducationId: 6, Description: "BSc" }];

education.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        education.collection.insert(educationArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
})

module.exports = mongoose.model('Education', EducationSchema);