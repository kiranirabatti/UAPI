var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../Config');
var connection = mongoose.createConnection(config.databaseURL);
var LoginSchema = new Schema({
    Username: { type: String, required: true, unique: true, default: '' },
    Password: { type: String, required: true, unique: true, default: '' },
    EmailId: { type: String, required: true, default: '' },
});
var users = mongoose.model('sysUser', LoginSchema);
module.exports = users;
//# sourceMappingURL=uLoginModels.js.map