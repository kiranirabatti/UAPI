var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var config = require('../../Config');
var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var connection = mongoose.createConnection(config.databaseURL);
autoIncrement.initialize(connection);

var loginSchema = new Schema({
    UserId: { type: Number, required: true },
    FirstName: { type: String, default: '' },
    LastName: { type: String, default: '' },
    UserPhone: { type: String, default: '' },
    UserEmailId: { type: String, required: true, default: '' },
    UserPassword: { type: String, required: true, default: '' },
    IsActive: { type: Boolean, default: false },
    IsSuperAdmin: { type: Boolean, default: false },
    CreatedOn: { type: Date, default: Date.now },
    CreatedBy: { type: String, default: '' },
    ModifiedOn: { type: Date, default: Date.now },
    ModifiedBy: { type: String, default: '' },
});

loginSchema.plugin(autoIncrement.plugin, {
    model: 'systemusers', field: 'UserId' ,startAt: 3,
    incrementBy: 1
});

loginSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('UserPassword')) return next();
     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.UserPassword, salt, function (err, hash) {
            if (err) return next(err);
            user.UserPassword = hash;
            next();
        });
    });
});

loginSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.UserPassword, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var users = mongoose.model('systemusers', loginSchema);

module.exports = users;