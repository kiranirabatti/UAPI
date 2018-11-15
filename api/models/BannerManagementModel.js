'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var bannerManagementSchema = new Schema({
    BannerId: { type: Number, required: true },
    Name: { type: String, required: true },
    IsActive: { type: Boolean, deafult: true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    UpdatedOn: { type: Date, default: Date.now },
    UpdatedBy: { type: String, default: '' },
}, { collection: 'BannerManagement' });
//var countersSchema = new Schema({
//    count: Number,
//    model: String,
//    field: String
//});
//module.exports = mongoose.model('identitycounters', countersSchema);
//var counters = mongoose.model('identitycounters');
//counters.find({}, function (err, data) {
//    console.log(data)
//});
//counters.save({ count: 1, "model": "BannerManagement", "field":"BannerId"})
var banner = mongoose.model('BannerManagement', bannerManagementSchema);
//var bannerArray = [{ BannerId: getNextSequenceValue("BannerId"), Name: "b1", IsActive: true }, { BannerId: getNextSequenceValue("BannerId"), Name: "b2", IsActive: true }, { BannerId: getNextSequenceValue("BannerId"), Name: "b3", IsActive: true }];
//banner.find({}, function (err, data) {
//    if (err)
//        return console.error(err);
//    if (data == '') {
//        var arr = [];
//        //for (var i = 0; i <= bannerArray.length; i++) {
//        //    arr[] = bannerArray[i]
//        //}
//        banner.collection.insert(bannerArray, function (err, docs) {
//            console.log("***********")
//            console.log(docs)
//            if (err) {
//                return console.error(err);
//            }
//        });
//    }
//})
//function getNextSequenceValue(sequenceName) {
//    var banners = mongoose.model('BannerManagement');
//    var counters = mongoose.model('identitycounters');
//    console.log(banners.find.length + 1)
//    //counters.find({}, function (err, data) {
//    //console.log(data)
//    //});
//    //console.log(counters.find());
//    var conditions = { model: 'BannerManagement' }
//        , update = { count:banners.find.length + 1}
//        , options = { multi: true };
//    var sequenceDocument = counters.findOneAndUpdate({ "model": "Member" }, { $inc: { "count": 1 } })
//    //    {
//    //    query: { field: 'BannerId' },
//    //    update: { $inc: { count: 1 } },
//    //    new: true
//    //});
//   // console.log(sequenceDocument)
//    return sequenceDocument.sequence_value;
//}
autoIncrement.initialize(mongoose.connection);
bannerManagementSchema.plugin(autoIncrement.plugin, {
    model: 'BannerManagement', field: 'BannerId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('BannerManagement', bannerManagementSchema);
//# sourceMappingURL=BannerManagementModel.js.map