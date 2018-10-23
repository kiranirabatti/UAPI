'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var OTPAuthenticationSchema = new Schema({
	OTPAuthenticationId: { type: Number, required: true },
	EmailAddress: { type: String, required: true },
	OTP: { type: Number, required: true },
	CreatedTime: { type: Date, required: true },
	ExpiredTime: { type: Date, required: true }
}, { collection: 'OTPAuthentication' });

autoIncrement.initialize(mongoose.connection);
OTPAuthenticationSchema.plugin(autoIncrement.plugin, {
	model: 'OTPAuthentication', field: 'OTPAuthenticationId', startAt: 1,
	incrementBy: 1
});
module.exports = mongoose.model('OTPAuthentication', OTPAuthenticationSchema);
