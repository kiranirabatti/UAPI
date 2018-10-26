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
    { EducationId: 2, Description: "Uneducated" },
    { EducationId: 3, Description: "1st" },
    { EducationId: 4, Description: "2nd" },
    { EducationId: 5, Description: "3rd" },
    { EducationId: 6, Description: "4th" },
    { EducationId: 7, Description: "5th" },
    { EducationId: 8, Description: "6th" },
    { EducationId: 9, Description: "7th" },
    { EducationId: 10, Description: "8th" },
    { EducationId: 11, Description: "9th" },
    { EducationId: 12, Description: "10th" },
    { EducationId: 13, Description: "12th" },
    { EducationId: 14, Description: "BA" },
    { EducationId: 15, Description: "BSc" },
    { EducationId: 16, Description: "BE" }
];
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
});
module.exports = mongoose.model('Education', EducationSchema);
//# sourceMappingURL=EducationModel.js.map