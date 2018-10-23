'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var CitizenshipSchema = new Schema({
    CitizenshipId: { type: Number },
    Description: { type: String }
}, { collection: 'Citizenship' });
var citizenship = mongoose.model('Citizenship', CitizenshipSchema);
var citizenshipArray = [{ CitizenshipId: 1, Description: "All" },
    { CitizenshipId: 2, Description: "India" },
    { CitizenshipId: 3, Description: "Australia" },
    { CitizenshipId: 4, Description: "China" },
    { CitizenshipId: 5, Description: "USA" },
    { CitizenshipId: 6, Description: "Kenya" }];
citizenship.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        citizenship.collection.insert(citizenshipArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
});
module.exports = mongoose.model('Citizenship', CitizenshipSchema);
//# sourceMappingURL=CitizenshipModel.js.map