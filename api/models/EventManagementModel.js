'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
    EventId: { type: Number, required: true },
    EventName: { type: String, required: true },
    EventDescription: { type: String, default: '' },
    EventDate: { type: String, default: '' },
    EventVenue: { type: String, default: '' },
    IsActive: { type: Boolean, deafult: true },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    ModifiedOn: { type: Date, default: Date.now },
    ModifiedBy: { type: String, default: '' },
}, { collection: 'EventManagement' });
autoIncrement.initialize(mongoose.connection);
eventSchema.plugin(autoIncrement.plugin, {
    model: 'EventManagement', field: 'EventId', startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('EventManagement', eventSchema);
//# sourceMappingURL=EventManagementModel.js.map