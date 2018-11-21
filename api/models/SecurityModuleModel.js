'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var securityModuleSchema = new Schema({
    SecurityModuleId: { type: Number, required: true },
    SecurityModuleName: { type: String, required: true },
    Description: { type: String, default: '' },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
}, { collection: 'SecurityModule' });
autoIncrement.initialize(mongoose.connection);
securityModuleSchema.plugin(autoIncrement.plugin, {
    model: 'SecurityModule', field: 'SecurityModuleId', startAt: 1,
    incrementBy: 1
});
var SecurityModule = mongoose.model('SecurityModule', securityModuleSchema);
var SecurityModuleArray = [
    { SecurityModuleId: 1, SecurityModuleName: "Member and Family Member", Description: "member" },
    { SecurityModuleId: 2, SecurityModuleName: "Committee Member", Description: "committee members" },
    { SecurityModuleId: 3, SecurityModuleName: "Event", Description: "Events" },
    { SecurityModuleId: 4, SecurityModuleName: "Advertisement", Description: "Advertisements" },
    { SecurityModuleId: 5, SecurityModuleName: "Banner", Description: "Banner" }
];
var counters = mongoose.model('identitycounters');
SecurityModule.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        SecurityModule.nextCount(function (err, count) {
            count === 1;
            SecurityModule.resetCount(function (err, nextCount) {
                nextCount === 0;
            });
        });
        SecurityModule.collection.insert(SecurityModuleArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
            else {
                counters.findOneAndUpdate({
                    model: 'SecurityModule'
                }, { $set: { count: SecurityModuleArray.length } }, { upsert: false }, function (err, res) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }
        });
    }
    else if (data.length == 4) {
        var myobj = { SecurityModuleId: 5, SecurityModuleName: "Banner", Description: "Banner" };
        SecurityModule.collection.insertOne(myobj, function (err, res) {
            if (err)
                throw err;
        });
    }
});
module.exports = mongoose.model('SecurityModule', securityModuleSchema);
//# sourceMappingURL=SecurityModuleModel.js.map