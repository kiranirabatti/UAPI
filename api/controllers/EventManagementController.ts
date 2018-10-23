var num = require("crypto");
var guid = num.randomBytes(16).toString("hex");
var mongoose = require('mongoose'),
    eventManagement = mongoose.model('EventManagement'),
    eventPhoto = mongoose.model('EventPhotos'),
    path = require('path'),
    fs = require('fs');

exports.getAllEvents = function (req, res) {
    eventManagement.find({}, function (err, events) {
        if (err)
            res.send(err);
        res.json(events);
    });
};
exports.searchEvent = function (req, res) {
    var fieldName = req.params.eventFieldname,
        regex = new RegExp(req.params.eventSearchvalue, 'i'),
        query = {};
    query[fieldName] = regex;
    eventManagement.find(query, function (err, events) {
        if (err)
            res.send(err);
        res.json(events);
    });
};
exports.createEvent = function (req, res) {
    var newEvent = new eventManagement(req.body);
    newEvent.save(function (err, data) {
        if (err)
            res.send(err);
        res.json('');
    });
};
exports.updateEvent = function (req, res) {
    var date = new Date;
    req.body.ModifiedOn = date;
    eventManagement.findOneAndUpdate({ EventId: req.params.EventId }, req.body, { new: true }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.getEventById = function (req, res) {
    eventManagement.find({ EventId: req.params.EventId }, function (err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};
exports.uploadEventPhotos = function (req, res) {
    var extension,
        newEvent,
        guid,
        eventDir = ('./Photos/Event');
    if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir);
    }
    var dir = (eventDir +'/' + req.params.EventId),noOfFiles = req.body.FileName[0].length;
    if (noOfFiles == 1) {
        guid = num.randomBytes(16).toString("hex");
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
        newEvent = new eventPhoto(req.body);
        newEvent.EventPhotoId = req.body.EventPhotoId;
        newEvent.EventId = req.params.EventId;
        newEvent.FileName = req.body.FileName;
        newEvent.FilePath = './Photos/Event/' + req.params.EventId + '/' + guid + '.' + extension;
        newEvent.FileNameInFolder = guid + '.' + extension;
        newEvent.save(function (err, data) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var base64Data = req.body.imageFile.replace(/^data:image\/\w+;base64,/, "");
            fs.writeFile((dir + "/" + guid + '.' + extension), base64Data, 'base64', function (err) {
                console.log(err);
            });
            if (err)
                res.send(err);
            res.json('');
        });
    }
    else {
        for (var i = 0; i < req.body.FileName.length; i++) {
            guid = num.randomBytes(16).toString("hex");
            extension = req.body.FileName[i].slice((req.body.FileName[i].lastIndexOf(".") - 1 >>> 0) + 2);
            newEvent = new eventPhoto(req.body);
            newEvent.EventPhotoId = req.body.EventPhotoId;
            newEvent.EventId = req.params.EventId;
            newEvent.FileName = req.body.FileName[i];
            newEvent.FilePath = './Photos/Event/' + req.params.EventId + '/' + guid + '.' + extension;
            newEvent.FileNameInFolder = guid + '.' + extension;
            newEvent.save(function (err, data) {
                if (err)
                    res.send(err);
            });
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var base64Data = req.body.imageFile[i].replace(/^data:image\/\w+;base64,/, "");
            fs.writeFile((dir + "/" + guid + '.' + extension), base64Data, 'base64', function (err) {
                console.log(err);
            });
        }
        res.json('');
    }
};
exports.getEventPhotosById = function (req, res) {
    eventPhoto.find({ EventId: req.params.EventId }, function (err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
};
exports.eventPhotos = function (req, res) {
    var fileLocation = './Photos/Event/' + req.params.EventId + '/' + req.params.photoId;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
};
exports.deletePhoto = function (req, res) {
    eventPhoto.remove({
        EventPhotoId: req.params.PhotoId
    }, function (err, event) {
        if (err)
            res.send(err);
        var fileLocation = './Photos/Event/' + req.params.EventId + '/' + req.params.name;
        if (fs.existsSync(fileLocation)) {
            fs.unlinkSync(fileLocation);
        }
        res.json('');
    });
};
exports.joinEventModelWithPhotos = function (req, res) {
    eventManagement.aggregate([
        {
            $lookup: {
                from: 'EventPhotos',
                localField: 'EventId',
                foreignField: 'EventId',
                as: 'EventWithPhoto'
            }
        },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.EventModelWithPhotos = function (req, res) {
    eventManagement.aggregate([
        {
            $lookup:
            {
                from: 'EventPhotos',
                localField: 'EventId',
                foreignField: 'EventId',
                as: 'EventWithPhoto'
            }
        },
        {
            "$sort": {
                "EventDate": 1
            }
        },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getEventsPhotos = function (req, res) {
    var fileLocation = './Photos/Event/' + req.params.EventId + '/' + req.params.FileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
}
//# sourceMappingURL=EventManagementController.js.map