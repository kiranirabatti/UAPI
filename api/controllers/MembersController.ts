const Num = require("crypto");
var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    path = require('path'),
    fs = require('fs'),
    config = require('../../Config');


exports.createMember = function (req, res) {
    var newmember = new Member(req.body),
        GUID = Num.randomBytes(16).toString("hex"),
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2);

    if (!req.body.Image.startsWith(config.nodeURL+'/getStaticImage')) {
        newmember.FileNameInFolder = GUID + '.' + extension
    }
    newmember.save(function (err, data) {
        if (err)
            res.send(err);
        res.json({ Member_Id: newmember.MemberId, MemberName: newmember.FullName });
        if (req.body.Image) {
            if (!req.body.Image.startsWith(config.nodeURL+'/getStaticImage')) {
                var memberDir = ('./Photos/Members');
                if (!fs.existsSync(memberDir)) {
                    fs.mkdirSync(memberDir);
                }
                var dir = (memberDir + '/' + newmember.MemberId)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var base64Data = req.body.Image.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
}

exports.getAllMembers = function (req, res) {
    Member.find({}, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.sendMemberPhoto = function (req, res) {
    var fileLocation = './Photos/Members/' + req.params.MemberId + '/' + req.params.fileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
}

exports.getMemberbyId = function (req, res) {
    Member.find({ MemberId: req.params.MemberId }, function (err, member) {
        if (err)
            res.send(err);
        res.json({ Member_Id: member[0].MemberId, member: member });
    });
};

exports.updateMember = function (req, res) {
    var date = new Date,
        GUID = Num.randomBytes(16).toString("hex"),
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2),
        flag = false;
    if (req.body.Image.startsWith(config.nodeURL+'/getStaticImage')) {
        flag = true;
    }
    req.body.UpdatedOn = date;

    if (!flag) {
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName
    }
    Member.findOneAndUpdate({ MemberId: req.params.MemberId }, req.body, { new: true }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
        if (req.body.Image) {
            if (!flag) {
                var memberDir = ('./Photos/Members');
                if (!fs.existsSync(memberDir)) {
                    fs.mkdirSync(memberDir);
                }
                var dir = (memberDir + '/' + req.params.MemberId);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var FilePath = dir + '/' + req.body.OldFileName;
                if (fs.existsSync(FilePath) && req.body.OldFileName) {
                    fs.unlinkSync(FilePath);
                }
                var base64Data = req.body.Image.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
};

exports.searchUser = function (req, res) {
    var fieldName = req.params.fieldname;
    var regex = new RegExp(req.params.searchvalue, 'i');
    var query = {};
    query[fieldName] = regex;
    Member.find(
        query
        , function (err, member) {
            if (err)
                res.send(err);
            res.json(member);
        });
};

