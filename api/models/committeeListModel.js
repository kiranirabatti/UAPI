"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var committeeSchema = new Schema({
    CommitteeMemberId: { type: Number, required: true },
    CommitteeMemberName: { type: String, required: true },
    CommitteeMemberDesignation: { type: String, default: '' },
    CommitteeMemberAddress: { type: String, default: '' },
    CommitteeMemberEmail: { type: String, default: '' },
    CommitteeMemberPhone: { type: String, default: '' },
    CommitteeMemberPhotoURL: { type: buffer_1.Buffer, default: '' },
    CommitteeMemberIsActive: { type: String, default: '' },
    CreatedOn: { type: String, default: '' },
    CreatedBy: { type: String, default: '' },
    ModifiedOn: { type: String, default: '' },
    ModifiedBy: { type: String, default: '' },
}, { collection: 'CommitteeMember' });
autoIncrement.initialize(mongoose.connection);
committeeSchema.plugin(autoIncrement.plugin, {
    model: 'CommitteeMember', field: 'CommitteeMemberId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('CommitteeMember', committeeSchema);
//# sourceMappingURL=committeeListModel.js.map