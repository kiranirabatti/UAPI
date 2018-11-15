'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
//const Auto_Increment = require('mongoose-sequence')(mongoose);
var MembersSchema = new Schema({
    MemberId: { type: Number, required: true },
    Gender: { type: String, required: true },
    FullName: { type: String, required: true, default: '' },
    FatherName: { type: String, required: true, default: '' },
    Address: { type: String, required: true, default: '' },
    Taluka: { type: String, required: true, default: '' },
    Jeello: { type: String, required: true, default: '' },
    PinCode: { type: Number, required: true, default: '' },
    HomePhone: { type: String, required: false, default: '' },
    MobileNo: { type: String, required: true, default: '' },
    Email: { type: String, required: false, default: '' },
    GrandFatherName: { type: String, required: true, default: '' },
    Gol: { type: String, required: true, default: '' },
    PetaAttak: { type: String, default: '' },
    MulVatan: { type: String, required: true, default: '' },
    OtherInformation: { type: String, required: false, default: '' },
    FileName: { type: String, default: '' },
    IsActive: { type: Boolean, deafult: true },
    FileNameInFolder: { type: String, default: '' },
    Ajivansabhyanumber: { type: String, required: true, default: '' },
    FormSubmittedOn: { type: Date, required: true, default: Date.now },
    FormSubmittedBy: { type: String, required: false, default: '' },
    UpdatedOn: { type: Date, required: true, default: Date.now },
    UpdatedBy: { type: String, required: false, default: '' },
}, { collection: 'Member' });
//MembersSchema.plugin(Auto_Increment, { id: 'Member_seq', inc_field: 'MemberId', disable_hooks: true });
autoIncrement.initialize(mongoose.connection);
MembersSchema.plugin(autoIncrement.plugin, {
    model: 'Member', field: 'MemberId', startAt: 1,
    incrementBy: 1
});
//var Member = mongoose.model('Member', MembersSchema),
//    member = new Member();
//Member.find({}, function (err, data) {
//    if (err)
//        return console.error(err);
//        member.save(function (err) {
//            member.MemberId === 1
//            member.nextCount(function (err, count) {
//                console.log(count)
//                count === 2 
//                if (data == '') {
//                    member.resetCount(function (err, nextCount) {
//                        console.log('next count');
//                        console.log(nextCount)
//                        nextCount === 1
//                    });
//                } else {
//                    member.resetCount(function (err, nextCount) {
//                        console.log('next count');
//                        nextCount = parseInt(data.length+1)
//                        console.log(nextCount)
//                    });
//                }
//            });
//        });
//    //}
//})
//var Member = mongoose.model('Member', MembersSchema),
//    member = new Member();
//member.save(function (err) {
//    // book._id === 100 -> true
//    member.nextCount(function (err, count) {
//        console.log(count)
//         //count === 101 -> true
//        member.resetCount(function (err, nextCount) {
//            // nextCount === 100 -> true
//        });
//    });
//});
module.exports = mongoose.model('Member', MembersSchema);
//# sourceMappingURL=MemberModel.js.map