import { Buffer } from "buffer";
'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var committeeSchema = new Schema({ 
    CommitteeMemberId: { type: Number, required: true },
    CommitteeMemberDesignation: { type: Number, default: '' },
    MemberType: { type: String, default: '' },
    MemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Members' },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    ModifiedOn: { type: Date, default: Date.now },
    ModifiedBy: { type: String, default: '' },
}, { collection: 'CommitteeMember' });

autoIncrement.initialize(mongoose.connection);
committeeSchema.plugin(autoIncrement.plugin, {
	model: 'CommitteeMember', field: 'CommitteeMemberId', startAt: 1,
	incrementBy: 1});
module.exports = mongoose.model('CommitteeMember', committeeSchema);

