'use strict';
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var HeightSchema = new Schema({
    HeightId: { type: Number },
    Description: { type: String }
}, { collection: 'Height' });
var Height = mongoose.model('Height', HeightSchema);
var HeightArray = [{ HeightId: 1, Description: "All" },
    { HeightId: 2, Description: "4 '6" },
    { HeightId: 3, Description: "4 '7" },
    { HeightId: 4, Description: "4 '8" },
    { HeightId: 5, Description: "4 '9" },
    { HeightId: 6, Description: "4 '10" },
    { HeightId: 7, Description: "4 '11" },
    { HeightId: 8, Description: "5 '0" },
    { HeightId: 9, Description: "5 '1" },
    { HeightId: 10, Description: "5 '2" },
    { HeightId: 11, Description: "5 '3" },
    { HeightId: 12, Description: "5 '4" },
    { HeightId: 13, Description: "5 '5" },
    { HeightId: 14, Description: "5 '6" },
    { HeightId: 15, Description: "5 '7" },
    { HeightId: 16, Description: "5 '8" },
    { HeightId: 17, Description: "5 '9" },
    { HeightId: 18, Description: "5 '10" },
    { HeightId: 19, Description: "6 '0" },
    { HeightId: 20, Description: "6 '1" },
    { HeightId: 21, Description: "6 '2" },
    { HeightId: 22, Description: "6 '3" },
    { HeightId: 23, Description: "6 '4" },
    { HeightId: 24, Description: "6 '5" },
    { HeightId: 25, Description: ">=6 '6" },
];
Height.find({}, function (err, data) {
    if (err)
        return console.error(err);
    if (data == '') {
        Height.collection.insert(HeightArray, function (err, docs) {
            if (err) {
                return console.error(err);
            }
        });
    }
});
module.exports = mongoose.model('Height', HeightSchema);
//# sourceMappingURL=HeightModel.js.map