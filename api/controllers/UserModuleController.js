var mongoose = require('mongoose'), userModule = mongoose.model('UserModule'), securityModule = mongoose.model('SecurityModule');
exports.updateUserModule = function (req, res) {
    userModule.findOneAndUpdate({ UserModuleId: req.params.userModuleId }, req.body, { new: true }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.createUserModule = function (req, res) {
    var newUserModule = new userModule(req.body);
    newUserModule.SystemUserId = req.body.SystemUserId;
    newUserModule.SecurityModuleId = req.body.SecurityModuleId;
    newUserModule.IsActive = req.body.IsActive;
    newUserModule.save(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.joinUserModWithSecurityMod = function (req, res) {
    securityModule.aggregate([
        {
            $lookup: {
                from: 'UserModule',
                localField: 'SecurityModuleId',
                foreignField: 'SecurityModuleId',
                as: 'getJoinedData'
            }
        },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
exports.getUserModulesById = function (req, res) {
    userModule.find({ SystemUserId: req.params.SystemUserId }, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};
//# sourceMappingURL=UserModuleController.js.map