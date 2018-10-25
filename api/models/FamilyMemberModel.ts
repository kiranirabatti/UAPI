'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var FamilyMembersSchema = new Schema({
    FamilyMemberId: { type: Number, required: true },
    MemberId: { type: Number, required: true },
    Name: { type: String, required: true, default: '' },
    Relation: { type: String, required: true, default: '' },
    Dob: { type: String, required: true, default: '' },
    BloodGroup: { type: String, required: true, default: '' },
    Education: { type: Number, required: true, default: '' },
    MaritalStatus: { type: String, required: true, default: '' },
    MarriageDate: { type: String, required: false, default: '' },
    LookingForPartner: { type: String, default: '' },
    PartnerHeight: { type: Number,default: '' },
    Email: { type: String, required: false, default: '' },
    Occupation: { type: String, required: true, default: '' },
    OccupationType: { type: String, default: '' },
    Mobile: { type: String, required: false, default: '' },
    BusinessAddress: { type: String, required: true, default: '' },
    Filename: { type: String },
    FileNameInFolder: { type: String, default: '' },
    Gender: { type: String, required: true },
    Weight: { type: String },
    SkinTone: { type: String },
    City: { type: Number, default: '' },
    Citizenship: { type: Number, default: '' },
    Native: { type: Number, default: '' },
    Manglik: { type: String, default: '' },
    Handicaped: { type: Boolean, default: false },
    Age: { type: Number },
    FormSubmittedOn: { type: Date, required: true, default: Date.now },
    FormSubmittedBy: { type: String, required: false, default: '' },
    UpdatedOn: { type: Date, required: true, default: Date.now },
    UpdatedBy: { type: String, required: false, default: '' },
}, { collection: 'FamilyMember' });

autoIncrement.initialize(mongoose.connection);
FamilyMembersSchema.plugin(autoIncrement.plugin, {
    model: 'FamilyMember', field: 'FamilyMemberId',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('FamilyMember', FamilyMembersSchema);