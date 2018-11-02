'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var OTPAuthenticationSchema = new Schema({
    OTPAuthenticationId: { type: Number, required: true },
    ReferenceId: { type: Number, required: true},
    IsMember: { type: Boolean, deafult: true },
    LoggedIn: { type: String, required: true },
    ClientIp: { type: String, required: false },
    OTP: { type: Number, required: false }
}, { collection: 'OTPAuthentication' });

autoIncrement.initialize(mongoose.connection);
OTPAuthenticationSchema.plugin(autoIncrement.plugin, {
	model: 'OTPAuthentication', field: 'OTPAuthenticationId', startAt: 1,
	incrementBy: 1
});
module.exports = mongoose.model('OTPAuthentication', OTPAuthenticationSchema);
