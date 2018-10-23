'use strict';
var fs = require('fs');
var mongoose = require('mongoose'), Committee = mongoose.model('CommitteeMember');
var path = require('path');
var jwt = require('jsonwebtoken');
exports.getAllCommitteeMembers = function (req, res) {
    Committee.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.searchCommitteeMemberbyName = function (req, res) {
    Committee.find({ CommitteeMemberName: new RegExp(req.params.Name, 'i') }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.CreateCommitteeMember = function (req, res) {
    var date = new Date();
    var new_committee = new Committee();
    if (req.files) {
        var imageFile = req.files.file;
        new_committee.CommitteeMemberPhotoURL = imageFile.data;
    }
    new_committee.CommitteeMemberName = req.body.CommitteeMemberName;
    new_committee.CommitteeMemberAddress = req.body.CommitteeMemberAddress;
    new_committee.CommitteeMemberDesignation = req.body.CommitteeMemberDesignation;
    new_committee.CommitteeMemberEmail = req.body.CommitteeMemberEmail;
    new_committee.CommitteeMemberPhone = req.body.CommitteeMemberPhone;
    new_committee.CreatedOn = date;
    new_committee.save(function (err, data) {
        if (err)
            res.send(err);
        res.json('');
    });
};
exports.getCommitteeMemberbyId = function (req, res) {
    Committee.find({ CommitteeMemberId: req.params.CommitteeMemberId }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.updateCommitteeMember = function (req, res) {
    var date = new Date();
    if (req.files) {
        var imageFile = req.files.file;
        req.body.CommitteeMemberPhotoURL = imageFile.data;
    }
    req.body.ModifiedOn = date;
    Committee.findOneAndUpdate({ CommitteeMemberId: req.params.CommitteeMemberId }, req.body, { new: true }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data.CommitteeMemberId);
    });
};
exports.deleteCommitteeMember = function (req, res) {
    Committee.remove({
        CommitteeMemberId: req.params.CommitteeMemberId
    }, function (err, data) {
        if (err)
            res.send(err);
        res.json({ message: 'Committee member has been deleted.' });
    });
};
exports.getImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/profile-picture-admin.png'));
};
exports.searchCommitteeMember = function (req, res) {
    var fieldName = req.params.fieldName;
    var regex = new RegExp(req.params.searchValue, 'i');
    var query = {};
    query[fieldName] = regex;
    Committee.find(query, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
//# sourceMappingURL=committeeListController.js.map