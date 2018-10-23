'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var DesignationSchema = new Schema({
    DesignationId: { type: Number },
    Designation: { type: String }
}, { collection: 'Designation' });
var Designation = mongoose.model('Designation', DesignationSchema);
var DesignationArray = [{ DesignationId: 1, Designation: "PRESIDENT" },
    { DesignationId: 2, Designation: "COMMITTEE MEMBER" },
    { DesignationId: 3, Designation: "SALAHAKAR" },
    { DesignationId: 4, Designation: "VICE PRESIDENT" },
    { DesignationId: 5, Designation: "ORG. SECRETARY" },
    { DesignationId: 6, Designation: "SECRETARY" },
    { DesignationId: 7, Designation: "JOINT SECRETARY" },
    { DesignationId: 8, Designation: "GENERAL SECRETARY" },
    { DesignationId: 9, Designation: "CO-ORDINATOR SECRETARY" },
    { DesignationId: 10, Designation: "TRESURER" },
    { DesignationId: 11, Designation: "EDITOR" },
    { DesignationId: 12, Designation: "CO-EDITOR" },
    { DesignationId: 13, Designation: "OFFI. SECRETARY" },
    { DesignationId: 14, Designation: "M TRUSTEE" },
    { DesignationId: 15, Designation: "TRUSTEE" },
    { DesignationId: 16, Designation: "CONVENOR" },
    { DesignationId: 17, Designation: "EDU. CONVENOR" },
    { DesignationId: 18, Designation: "INVITEE" },
    { DesignationId: 19, Designation: "INTERNAL AUDITOR" },
];
Designation.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        Designation.collection.insert(DesignationArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
});
module.exports = mongoose.model('Designation', DesignationSchema);
//# sourceMappingURL=Designation.js.map