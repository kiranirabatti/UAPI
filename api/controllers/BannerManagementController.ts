var mongoose = require('mongoose'),
    banner = mongoose.model('BannerManagement'),
    bannerPhoto = mongoose.model('BannerPhoto'),
    path = require('path'),
    fs = require('fs'),
    config = require('../../Config'),
    moment = require('moment');
const randomNumber = require("crypto");
var multer = require('multer');

exports.getAllBanners = function (req, res) {
    banner.find({}, function (err, banner) {
        if (err)
            res.send(err);
        res.json(banner);
    });
};

exports.createBanner = function (req, res) {
    var newBanner = new banner(req.body),
        extension,
        newPhoto,
        guid,
        BannerDir = ('./Photos/Banners');
    newBanner.save(function (err, data) {
        if (err)
            res.send(err);
        res.json("");
        if (!fs.existsSync(BannerDir)) {
            fs.mkdirSync(BannerDir);
        }
        var dir = (BannerDir + '/' + newBanner.BannerId);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        if (req.body.NoOfFiles == 1) {
            var image = req.body.imageFile
            guid = randomNumber.randomBytes(16).toString("hex");
            extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
            newPhoto = new bannerPhoto(req.body);
            newPhoto.BannerId = newBanner.BannerId;
            newPhoto.FileName = req.body.FileName;
            newPhoto.FilePath = './Photos/Banners/' + newBanner.BannerId + '/' + guid + '.' + extension;
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
                guid = randomNumber.randomBytes(16).toString("hex");
                extension = req.body.FileName[i].slice((req.body.FileName[i].lastIndexOf(".") - 1 >>> 0) + 2);
                newPhoto = new bannerPhoto(req.body);
                newPhoto.BannerId = newBanner.BannerId;
                newPhoto.FileName = req.body.FileName[i];
                newPhoto.FilePath = './Photos/Banners/' + newBanner.BannerId + '/' + guid + '.' + extension;
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

exports.updateBanner = function (req, res) {
    var date = new Date,
        GUID = randomNumber.randomBytes(16).toString("hex"),
        extension,
        newPhoto,
        Photos = false;
    if (req.body.NoOfFiles == 0) {
        Photos = true;
    }
    req.body.UpdatedOn = date;
    if (!Photos) {
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName;
    }
    banner.findOneAndUpdate({ BannerId: req.params.BannerId }, req.body, { new: true }, function (err, banner) {
        if (err)
            res.send(err);
        res.json(banner);
    });
    var Dir = ('./Photos/Banners');
    if (!fs.existsSync(Dir)) {
        fs.mkdirSync(Dir);
    }
    var dir = (Dir + '/' + req.params.BannerId);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!Photos) {
        if (req.body.NoOfFiles == 1) {
            GUID = randomNumber.randomBytes(16).toString("hex");
            extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
            newPhoto = new bannerPhoto();
            newPhoto.BannerId = req.params.BannerId;
            newPhoto.FileName = req.body.FileName;
            newPhoto.FilePath = './Photos/Banners/' + req.params.BannerId + '/' + GUID + '.' + extension;
            newPhoto.FileNameInFolder = GUID + '.' + extension;
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
                GUID = randomNumber.randomBytes(16).toString("hex");
                extension = req.body.FileName[i].slice((req.body.FileName[i].lastIndexOf(".") - 1 >>> 0) + 2);
                newPhoto = new bannerPhoto();
                newPhoto.BannerId = req.params.BannerId;
                newPhoto.FileName = req.body.FileName;
                newPhoto.FilePath = './Photos/Banners/' + req.params.BannerId + '/' + GUID + '.' + extension;
                newPhoto.FileNameInFolder = GUID + '.' + extension;
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
    }
};

exports.getBannerById = function (req, res) {
    banner.find({ BannerId: req.params.BannerId }, function (err, data) {
        if (err)
            res.send(err);

        res.json({ data: data });
    });
};

exports.getBannerPhotosById = function (req, res) {
    bannerPhoto.find({ BannerId: req.params.BannerId }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.sendBannerPhoto = function (req, res) {
    var fileLocation = './Photos/Banners/' + req.params.BannerId + '/' + req.params.fileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
};

exports.deleteBannerPhoto = function (req, res) {
    bannerPhoto.remove({
        BannerPhotoId: req.params.PhotoId
    }, function (err, data) {
        if (err)
            res.send(err);
        var fileLocation = './Photos/Banners/' + req.params.BannerId + '/' + req.params.name;
        if (fs.existsSync(fileLocation)) {
            fs.unlinkSync(fileLocation);
        }
        res.json('')
    });
}

exports.searchBanner = function (req, res) {
    var searchValue = req.params.bannerSearchvalue, fieldName = req.params.bannerFieldname;
    var regex = new RegExp(searchValue, 'i'), query = {};
    query[fieldName] = regex;
    banner.find(query, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.deleteBanner = function (req, res) {
    banner.remove({
        BannerId: req.params.BannerId
    }, function (err, data) {
        if (err)
            res.send(err);
        res.json({ message: 'Banner has been deleted.' });
    });
};