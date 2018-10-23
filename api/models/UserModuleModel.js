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
    model: 'UserModule', field: 'UserModuleId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('UserModule', userModuleSchema);
//# sourceMappingURL=UserModuleModel.js.map