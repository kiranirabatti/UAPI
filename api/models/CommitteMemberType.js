'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var CommitteeMemberTypeSchema = new Schema({
    TypeId: { type: Number },
    Description: { type: String }
}, { collection: 'CommitteeMemberType' });
var MemberType = mongoose.model('CommitteeMemberType', CommitteeMemberTypeSchema);
var CommitteeMemberTypeArray = [
    { TypeId: 1, Description: "Core" },
    { TypeId: 2, Description: "Active" },
    { TypeId: 3, Description: "Past" },
];
MemberType.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        MemberType.collection.insert(CommitteeMemberTypeArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
});
module.exports = mongoose.model('CommitteeMemberType', CommitteeMemberTypeSchema);
//# sourceMappingURL=CommitteMemberType.js.map