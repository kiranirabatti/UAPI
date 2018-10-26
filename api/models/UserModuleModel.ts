'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var userModuleSchema = new Schema({
    UserModuleId: { type: Number },
    SystemUserId: { type: Number, required: true },
    SecurityModuleId: { type: Number, required: true, ref: 'SecurityModule' },
    IsActive: { type: Boolean, deafult: true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
}, { collection: 'UserModule' });


autoIncrement.initialize(mongoose.connection);
userModuleSchema.plugin(autoIncrement.plugin, {
    model: 'UserModule', field: 'UserModuleId',
    incrementBy: 1,
    startAt: 1
});

var userModule = mongoose.model('UserModule', userModuleSchema);
var userModuleArray = [{ UserModuleId: 1, SystemUserId: 1, SecurityModuleId: 1, IsActive: true },
{ UserModuleId: 2, SystemUserId: 1, SecurityModuleId: 2, IsActive: true },
{ UserModuleId: 3, SystemUserId: 1, SecurityModuleId: 3, IsActive: true },
{ UserModuleId: 4, SystemUserId: 1, SecurityModuleId: 4, IsActive: true },
{ UserModuleId: 5, SystemUserId: 1, SecurityModuleId: 5, IsActive: true },
{ UserModuleId: 6, SystemUserId: 2, SecurityModuleId: 1, IsActive: true },
{ UserModuleId: 7, SystemUserId: 2, SecurityModuleId: 2, IsActive: true },
{ UserModuleId: 8, SystemUserId: 2, SecurityModuleId: 3, IsActive: true },
{ UserModuleId: 9, SystemUserId: 2, SecurityModuleId: 4, IsActive: true },
{ UserModuleId: 10, SystemUserId: 2, SecurityModuleId: 5, IsActive: true }
];

userModule.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        userModule.collection.insert(userModuleArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
})

module.exports = userModule;

