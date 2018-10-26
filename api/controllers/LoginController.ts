var mongoose = require('mongoose');
var user = mongoose.model('systemusers');
var jwt = require('jsonwebtoken');
var config = require('../../Config');
var bcrypt = require('bcrypt'),
    path = require('path'),
    fs = require('fs');

exports.userLogin = function(req, res) {
    var email = new RegExp("^" + req.params.emailId + "$", "i");
    var password = req.params.password;
    user.findOne({ UserEmailId: email }, function(err, user) {
        if (user) {
            var data = {
                'UserEmailId': user.UserEmailId,
            };
            if (err)
                throw err;
            user.comparePassword(password, function(err, isMatch) {
                if (err)
                    throw err;
                if (isMatch) {
                    var token = jwt.sign(data, config.secret, { expiresIn: 84600 })
                    res.json({ token: token, FirstName: user.FirstName, LastName: user.LastName, IsActive: user.IsActive, UserId: user.UserId, IsSuperAdmin: user.IsSuperAdmin })
                }
                else {
                    res.json({ token: err });
                }
            });
        }
        else {
            res.json(err);
        }
    });
};
exports.getAllUsers = function(req, res) {
    user.find({}, function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
};
exports.CreateUser = function(req, res) {
    var date = new Date();
    var new_user = new user(req.body);
    new_user.FirstName = req.body.FirstName;
    new_user.LastName = req.body.LastName;
    new_user.UserPhone = req.body.UserPhone;
    new_user.UserEmailId = req.body.UserEmailId;
    new_user.UserPassword = req.body.UserPassword;
    new_user.IsActive = req.body.IsActive;
    new_user.IsSuperAdmin = req.body.IsSuperAdmin;
    new_user.CreatedOn = date;
    new_user.save(function(err, data) {
        if (err)
            res.send(err);
        res.json({ SystemUserId: data.UserId });
    });
};
exports.searchUser = function(req, res) {
    var fieldName = req.params.userFieldname;
    var regex = new RegExp(req.params.userSearchvalue, 'i');
    var query = {};
    query[fieldName] = regex;
    user.find(query, function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
};
exports.getUserbyId = function(req, res) {
    user.find({ UserId: req.params.UserId }, function(err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.updateUser = function(req, res) {
    var password = req.body.UserPassword;
    var date = new Date();
    req.body.ModifiedOn = date;

    var query = { IsSuperAdmin: true }
    user.find({ IsSuperAdmin: true, UserId: { $ne: req.params.UserId } }, function(err, result) {
        if (err) throw err;
        if (result == '' && req.body.IsSuperAdmin == 'false') {
            res.json('One SuperAdmin');
        }
        else {
            user.findOneAndUpdate({ UserId: req.params.UserId }, req.body, { new: true }, function(err, data) {
                if (err)
                    res.send(err);
                res.json(data);
            });
        }
    });
};
exports.updateUserPassword = function(req, res) {
    var password = req.body.UserPassword;
    var date = new Date();
    req.body.ModifiedOn = date;
    var salt = bcrypt.genSaltSync(10);
    if (password !== '') {
        req.body.UserPassword = bcrypt.hashSync(password, salt);
    }
    user.findOneAndUpdate({ UserId: req.params.UserId }, req.body, { new: true }, function(err, data) {
        if (err)
            res.send(err);
        res.json(data.UserId);
    });
};
exports.existUserEmail = function(req, res) {
    console.log(req.params.email);
    user.findOne({ UserEmailId: req.params.email }, function(err, user) {
        if (user) {
            res.json(user);
            console.log(user);
        }
        else
            res.json('');
    });

}
exports.getAllSystemUsers = function(req, res) {
    user.find({}, function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
};
exports.getSystemUserById = function(req, res) {
    user.find({ UserId: req.params.UserId }, function(err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAdminLogo = function(req, res) {
    res.sendFile(path.resolve('./Photos/Admin_Logo.jpg'));
};

exports.getTotalCommiteeMemberImage = function(req, res) {
    res.sendFile(path.resolve('./Photos/totalCommitteeMember.png'));
};

exports.getTotalMemberImage = function(req, res) {
    res.sendFile(path.resolve('./Photos/totalMember.png'));
};

exports.getTotalFamilyMemberImage = function(req, res) {
    res.sendFile(path.resolve('./Photos/totalFamilyMember.png'));
};

exports.getTotalEventImage = function(req, res) {
    res.sendFile(path.resolve('./Photos/totalEvent.png'));
};