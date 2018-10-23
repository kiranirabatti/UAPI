'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var MembersSchema = new Schema({
    MemberId: { type: Number, required: true },
    Gender: { type: String, required: true },
    FullName: { type: String, required: true, default: '' },
    FatherName: { type: String, required: true, default: '' },
    SurName: { type: String, required: true, default: '' },
    Address: { type: String, required: true, default: '' },
    Taluka: { type: String, required: true, default: '' },
    Jeello: { type: String, required: true, default: '' },
    PinCode: { type: Number, required: true, default: '' },
    HomePhone: { type: String, required: true, default: '' },
    MobileNo: { type: String, required: true, default: '' },
    Email: { type: String, required: true, default: '' },
    GrandFatherName: { type: String, required: true, default: '' },
    Gol: { type: String, required: true, default: '' },
    PetaAttak: { type: String, required: true, default: '' },
    MulVatan: { type: String, required: true, default: '' },
    OtherInformation: { type: String, required: false, default: '' },
    FileName: { type: String, default: '' },
    IsActive: { type: Boolean, deafult: true },
    FileNameInFolder: { type: String, default: '' },
    Ajivansabhyanumber: { type: Number, required: true, default: '' },
    FormSubmittedOn: { type: Date, required: true, default: Date.now },
    FormSubmittedBy: { type: String, required: false, default: '' },
    UpdatedOn: { type: Date, required: true, default: Date.now },
    UpdatedBy: { type: String, required: false, default: '' },
}, { collection: 'Member' });
autoIncrement.initialize(mongoose.connection);
MembersSchema.plugin(autoIncrement.plugin, {
    model: 'Member', field: 'MemberId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('Member', MembersSchema);
//# sourceMappingURL=MemberModel.js.map