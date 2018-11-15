'use strict';
const random = require("crypto");
var mongoose = require('mongoose'),
    path = require('path'),
    fs = require('fs'),
    Member = mongoose.model('FamilyMember'),
    Height = mongoose.model('Height'),
    City = mongoose.model('City'),
    Citizenship = mongoose.model('Citizenship'),
    Native = mongoose.model('Native'),
    Education = mongoose.model('Education'),
    config = require('../../Config');

exports.createFamilyMember = function (req, res) {
    var familymember = new Member(req.body),
        GUID = random.randomBytes(16).toString("hex"),
        extension = req.body.Filename.slice((req.body.Filename.lastIndexOf(".") - 1 >>> 0) + 2);
    if (!req.body.file.startsWith(config.nodeURL+'/getStaticImage')) {
        familymember.FileNameInFolder = GUID + '.' + extension;
    }
    familymember.save(function (err, data) {
        if (err)
            res.send(err);
        console.log(err)
        res.json("");
        if (req.body.file) {
            if (!req.body.file.startsWith(config.nodeURL+'/getStaticImage')) {
                var memberDir = ('./Photos/FamilyMembers')
                if (!fs.existsSync(memberDir)) {
                    fs.mkdirSync(memberDir);
                }
                var dir = (memberDir + '/' + familymember.MemberId);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var newDir = (dir + '/' + familymember.FamilyMemberId);
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir);
                }
                var base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((newDir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
};

exports.getAllFamilyMembers = function (req, res) {
    Member.find({}, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.getFamilyMemberbyMemberId = function (req, res) {
    Member.find({ MemberId: req.params.MemberId }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.getFamilyMember = function (req, res) {
    Member.find({ FamilyMemberId: req.params.FamilyMemberId }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.updateFamilyMember = function (req, res) {
    var date = new Date,
        fs = require('fs'),
        GUID = random.randomBytes(16).toString("hex"),
        extension = req.body.Filename.slice((req.body.Filename.lastIndexOf(".") - 1 >>> 0) + 2),
        flag = false;
    if (req.body.file.startsWith(config.nodeURL+'/getStaticImage')) {
        flag = true;
    }
    req.body.UpdatedOn = date;
    if (!flag) {
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName
    }
    Member.findOneAndUpdate({ FamilyMemberId: req.params.MemberId }, req.body, { new: true }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
        if (req.body.file) {
            if (!flag) {
                var familyMemberDir = ('./Photos/FamilyMembers');
                if (!fs.existsSync(familyMemberDir)) {
                    fs.mkdirSync(familyMemberDir);
                }
                var dir = (familyMemberDir + '/' + req.body.MemberId);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var newDir = (dir + '/' + req.body.FamilyMemberId);
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir);
                }
                var FilePath = newDir + '/' + req.body.OldFileName;
                if (fs.existsSync(FilePath) && req.body.OldFileName) {
                    fs.unlinkSync(FilePath);
                }
                var base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((newDir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
};

exports.getImage = function (req, res) {
    var FileLocation = './Photos/FamilyMembers/' + req.params.memberId + '/' + req.params.fMemberId + '/' + req.params.fileName;
    if (fs.existsSync(FileLocation)) {
        res.sendFile(path.resolve(FileLocation));
    }
};

exports.getStaticImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/profile-picture.png'));
};

exports.getAllHeights = function (req, res) {
    Height.find({}, function (err, height) {
        if (err)
            res.send(err);
        res.json(height);
    });
};

exports.getAllEducation = function (req, res) {
    Education.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllCities = function (req, res) {
    City.find({}, function (err, cities) {
        if (err)
            res.send(err);
        res.json(cities);
    });
};

exports.getAllNatives = function (req, res) {
    Native.find({}, function (err, natives) {
        if (err)
            res.send(err);
        res.json(natives);
    });
};

exports.getAllCitizenships = function (req, res) {
    Citizenship.find({}, function (err, citizen) {
        if (err)
            res.send(err);
        res.json(citizen);
    });
};