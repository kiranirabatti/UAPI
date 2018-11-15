var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = new Schema({
    model: { type: String, required: true },
    field: { type: String, required: true },
    count: { type: Number, default: 1 }
});
module.exports = mongoose.model('Counters', counterSchema);
//# sourceMappingURL=Counters.js.map