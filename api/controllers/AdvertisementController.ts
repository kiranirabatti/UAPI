var mongoose = require('mongoose'),
    advertisement = mongoose.model('Advertisement'),
    advertisementType = mongoose.model('AdvertisementType'),
    advertisementLocation = mongoose.model('AdvertisementLocation'),
    advertisementPhoto = mongoose.model('AdvertisementPhotos'),
    path = require('path'),
    fs = require('fs'),
    config = require('../../Config'),
    moment = require('moment');
const number = require("crypto");

exports.getAllAdvertisements = function (req, res) {
    advertisement.find({}, function (err, advertisement) {
        if (err)
            res.send(err);
        res.json(advertisement);
    });
};

exports.searchAdvertisement = function (req, res) {
    var searchValue = req.params.advertisementSearchvalue, fieldName = req.params.advertisementFieldname;
    var regex = new RegExp(searchValue, 'i'), query = {};
    query[fieldName] = regex;
    advertisement.find(query, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.createAdvertisement = function (req, res) {
    var newAdvertisement = new advertisement(req.body),
        extension,
        newPhoto,
        guid,
        AdvertisementDir = ('./Photos/Advertisement');
    newAdvertisement.save(function (err, data) {
        if (err)
            res.send(err);
        console.log(err);
        res.json("");
        if (!fs.existsSync(AdvertisementDir)) {
            fs.mkdirSync(AdvertisementDir);
        }
        var dir = (AdvertisementDir + '/' + newAdvertisement.AdvertisementId);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (req.body.NoOfFiles == 1) {
            guid = number.randomBytes(16).toString("hex");
            extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
            newPhoto = new advertisementPhoto(req.body);
            newPhoto.AdvertisementPhotoId = req.body.AdvertisementPhotoId;
            newPhoto.AdvertisementId = newAdvertisement.AdvertisementId;
            newPhoto.FileName = req.body.FileName;
            newPhoto.FilePath = './Photos/Advertisement/' + newAdvertisement.AdvertisementId + '/' + guid + '.' + extension;
            newPhoto.FileNameInFolder = guid + '.' + extension;
            newPhoto.save(function (err, data) {
                var base64Data = req.body.imageFile.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + guid + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
                if (err)
                    res.send(err);
            });
        }
        else {
            for (let i = 0; i < req.body.NoOfFiles; i++) {
                guid = number.randomBytes(16).toString("hex");
                extension = req.body.FileName[i].slice((req.body.FileName[i].lastIndexOf(".") - 1 >>> 0) + 2);
                newPhoto = new advertisementPhoto(req.body);
                newPhoto.AdvertisementPhotoId = req.body.AdvertisementPhotoId;
                newPhoto.AdvertisementId = newAdvertisement.AdvertisementId;
                newPhoto.FileName = req.body.FileName[i];
                newPhoto.FilePath = './Photos/Advertisement/' + newAdvertisement.AdvertisementId + '/' + guid + '.' + extension;
                newPhoto.FileNameInFolder = guid + '.' + extension;
                newPhoto.save(function (err, data) {
                    if (err)
                        res.send(err);
                });
                var base64Data = req.body.imageFile[i].replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + guid + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });

};

exports.getAdvertisementById = function (req, res) {
    advertisement.find({ AdvertisementId: req.params.AdvertisementId }, function (err, data) {
        if (err)
            res.send(err);
        res.json({ data: data });
    });
};

exports.updateAdvertisement = function (req, res) {
    var date = new Date,
        GUID = number.randomBytes(16).toString("hex"),
        extension,
        newPhoto,
        isPhotos = false;
    if (req.body.NoOfFiles == 0) {
        isPhotos = true;
    }
    req.body.UpdatedOn = date;
    if (!isPhotos) {
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName;
    }
    advertisement.findOneAndUpdate({ AdvertisementId: req.params.AdvertisementId }, req.body, { new: true }, function (err, advertisement) {
        if (err)
            res.send(err);
        res.json(advertisement);
    });

    var Dir = ('./Photos/Advertisement');
    if (!fs.existsSync(Dir)) {
        fs.mkdirSync(Dir);
    }
    var dir = (Dir + '/' + req.params.AdvertisementId);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!isPhotos && req.body.AdvertisementLocation == 3 && req.body.IsNewVisitingCard == 'false') {
        req.body.FilePath = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + GUID + '.' + extension;
        advertisementPhoto.findOneAndUpdate({ AdvertisementPhotoId: req.body.AdvertisementPhotoId }, req.body, { new: true }, function (err, data) {
            if (err)
                res.send(err);
        });
        var FilePath = dir + '/' + req.body.OldFileName;
        if (fs.existsSync(FilePath) && req.body.OldFileName) {
            fs.unlinkSync(FilePath);
        }
        var base64Data = req.body.Image.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
            console.log(err);
        });
    }
    else if (!isPhotos) {
        if (req.body.NoOfFiles == 1) {
            GUID = number.randomBytes(16).toString("hex");
            extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
            newPhoto = new advertisementPhoto();
            newPhoto.AdvertisementId = req.params.AdvertisementId;
            newPhoto.FileName = req.body.FileName;
            newPhoto.FilePath = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + GUID + '.' + extension;
            newPhoto.FileNameInFolder = GUID + '.' + extension;
            newPhoto.AdvertisementLocation = req.body.AdvertisementLocation;
            newPhoto.save(function (err, data) {
                var base64Data = req.body.imageFile.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
                if (err)
                    res.send(err);
            });
        }
        else {
            for (let i = 0; i < req.body.NoOfFiles; i++) {
                GUID = number.randomBytes(16).toString("hex");
                extension = req.body.FileName[i].slice((req.body.FileName[i].lastIndexOf(".") - 1 >>> 0) + 2);
                newPhoto = new advertisementPhoto();
                newPhoto.AdvertisementId = req.params.AdvertisementId;
                newPhoto.FileName = req.body.FileName[i];
                newPhoto.FilePath = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + GUID + '.' + extension;
                newPhoto.FileNameInFolder = GUID + '.' + extension;
                newPhoto.AdvertisementLocation = req.body.AdvertisementLocation;
                newPhoto.save(function (err, data) {
                    if (err)
                        res.send(err);
                });
                var base64Data = req.body.imageFile[i].replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    } else if (req.body.AdvertisementLocation != 3 && isPhotos) {
        advertisementPhoto.updateMany({ AdvertisementId: req.params.AdvertisementId }, { $set: { AdvertisementLocation: req.body.AdvertisementLocation}} , { new: true }, function (err, data) {
            if (err)
                res.send(err);
        });
    }
};

exports.sendAdvertisementPhoto = function (req, res) {
    var fileLocation = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + req.params.fileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
};

exports.getDefaultImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/Placeholder.png'));
};

exports.getAllAdvertisementTypes = function (req, res) {
    advertisementType.find({}, function (err, advertisementTypes) {
        if (err)
            res.send(err);
        res.json(advertisementTypes);
    });
};

exports.getAllAdvertisementLocations = function (req, res) {
    advertisementLocation.find({}, function (err, locationsData) {
        if (err)
            res.send(err);
        res.json(locationsData);
    });
};

exports.getAdvertisementPhotosById = function (req, res) {
    advertisementPhoto.find({ AdvertisementId: req.params.AdvertisementId }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.deleteAdvertisementPhoto = function (req, res) {
    advertisementPhoto.remove({
        AdvertisementPhotoId: req.params.PhotoId
    }, function (err, data) {
        if (err)
            res.send(err);

        var fileLocation = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + req.params.name;
        if (fs.existsSync(fileLocation)) {
            fs.unlinkSync(fileLocation);
        }
        res.json('')
    });
}