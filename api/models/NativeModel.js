'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var NativeSchema = new Schema({
    NativeId: { type: Number },
    Name: { type: String }
}, { collection: 'Native' });
var native = mongoose.model('Native', NativeSchema);
var nativeArray = [{ NativeId: 1, Name: "All" },
    { NativeId: 2, Name: "Dump" },
    { NativeId: 3, Name: "Aagarva" },
    { NativeId: 4, Name: "Aaglol" },
    { NativeId: 5, Name: "Badol" },
    { NativeId: 6, Name: "Bagidol" }];
native.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        native.collection.insert(nativeArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
});
module.exports = mongoose.model('Native', NativeSchema);
//# sourceMappingURL=NativeModel.js.map