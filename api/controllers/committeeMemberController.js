'use strict';
var fs = require('fs');
var mongoose = require('mongoose');
var member = mongoose.model('Member');
var Committee = mongoose.model('CommitteeMember');
var Designation = mongoose.model('Designation');
var path = require('path');
var jwt = require('jsonwebtoken');
exports.getAllCommitteeMembers = function (req, res) {
    Committee.aggregate([
        {
            $lookup: {
                from: 'Member',
                localField: 'MemberId',
                foreignField: '_id',
                as: 'CommitteeMemberData'
            }
        },
        {
            $lookup: {
                from: 'Designation',
                localField: 'CommitteeMemberDesignation',
                foreignField: 'DesignationId',
                as: 'DesignationData'
            },
        },
        {
            "$sort": {
                "DesignationData.DesignationId": 1
            }
        }, {
            $unwind: { path: "$DesignationData" }
        }, {
            $unwind: { path: "$CommitteeMemberData" }
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.getAllDesignation = function (req, res) {
    Designation.find({}, function (err, designation) {
        if (err)
            res.send(err);
        res.json(designation);
    });
};
exports.CreateCommitteeMember = function (req, res) {
    var date = new Date();
    var new_committee = new Committee();
    new_committee.MemberId = req.body.MemberId;
    new_committee.CommitteeMemberDesignation = req.body.CommitteeMemberDesignation;
    new_committee.MemberType = req.body.MemberType;
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
    var searchValue = req.params.searchValue;
    var fieldName = req.params.fieldName;
    var regex = new RegExp(req.params.searchValue, 'i');
    var query = {};
    if (fieldName == 'CommitteeMemberData.FullName') {
        Committee.aggregate([
            {
                $lookup: {
                    from: 'Member',
                    localField: 'MemberId',
                    foreignField: '_id',
                    as: 'CommitteeMemberData'
                }
            },
            {
                $lookup: {
                    from: 'Designation',
                    localField: 'CommitteeMemberDesignation',
                    foreignField: 'DesignationId',
                    as: 'DesignationData'
                },
            },
            {
                "$sort": {
                    "DesignationData.DesignationId": 1
                }
            }, {
                $unwind: { path: "$DesignationData" }
            }, {
                $unwind: { path: "$CommitteeMemberData" }
            },
            { $project: { 'CommitteeMemberDesignation': 1, 'CommitteeMemberId': 1, 'MemberId': 1, 'MemberType': 1, 'CommitteeMemberData': '$CommitteeMemberData', 'DesignationData': '$DesignationData', name: { $concat: ["$CommitteeMemberData.FullName"] } } },
            { $match: { 'name': regex } },
        ]).exec(function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    }
    else {
        Committee.aggregate([
            {
                $lookup: {
                    from: 'Member',
                    localField: 'MemberId',
                    foreignField: '_id',
                    as: 'CommitteeMemberData'
                }
            },
            {
                $lookup: {
                    from: 'Designation',
                    localField: 'CommitteeMemberDesignation',
                    foreignField: 'DesignationId',
                    as: 'DesignationData'
                },
            },
            {
                "$sort": {
                    "DesignationData.DesignationId": 1
                }
            },
            {
                $match: (_a = {},
                    _a[fieldName] = regex,
                    _a)
            }, {
                $unwind: { path: "$DesignationData" }
            }, {
                $unwind: { path: "$CommitteeMemberData" }
            }
        ]).exec(function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    }
    var _a;
};
//# sourceMappingURL=committeeMemberController.js.map