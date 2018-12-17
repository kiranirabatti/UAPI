'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var EducationSchema = new Schema({
    EducationId: { type: Number },
    Description: { type: String }
}, { collection: 'Education' });

var education = mongoose.model('Education', EducationSchema);
var educationArray = [
    { EducationId: 1, Description: "All" },
    { EducationId: 2, Description: "Uneducated" },
    { EducationId: 3, Description: "Nursery" },
    { EducationId: 4, Description: "1st" },
    { EducationId: 5, Description: "2nd" },
    { EducationId: 6, Description: "3rd" },
    { EducationId: 7, Description: "4th" },
    { EducationId: 8, Description: "5th" },
    { EducationId: 9, Description: "6th" },
    { EducationId: 10, Description: "7th" },
    { EducationId: 11, Description: "8th" },
    { EducationId: 12, Description: "9th" },
    { EducationId: 13, Description: "10th" },
    { EducationId: 14, Description: "11th" },
    { EducationId: 15, Description: "12th" },
    { EducationId: 16, Description: "B.A" },
    { EducationId: 17, Description: "M.A" },
    { EducationId: 18, Description: "BCA" },
    { EducationId: 19, Description: "MCA" },
    { EducationId: 20, Description: "B.Sc" },
    { EducationId: 21, Description: "M.Sc " },
    { EducationId: 22, Description: "B.Com" },
    { EducationId: 23, Description: "M.Com" },
    { EducationId: 24, Description: "Diploma" },
    { EducationId: 25, Description: "BE" },
    { EducationId: 26, Description: "ME" },
    { EducationId: 27, Description: "B.Tech" },
    { EducationId: 28, Description: "M.Tech" },
    { EducationId: 29, Description: "B.Ed" },
    { EducationId: 30, Description: "M.Ed" },
    { EducationId: 31, Description: "D.Ed" },
    { EducationId: 32, Description: "Graduate" },
    { EducationId: 33, Description: "I.T.I" },
    { EducationId: 34, Description: "MBA" },
];

education.find({}, function(err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        education.collection.insert(educationArray, function(err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
})

module.exports = mongoose.model('Education', EducationSchema);