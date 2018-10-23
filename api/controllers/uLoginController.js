var mongoose = require('mongoose'), user = mongoose.model('sysUser');
exports.createUser = function (req, res) {
    var newUser = new user(req.body);
    console.log(newUser);
    newUser.save(function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};
exports.getAllUsers = function (req, res) {
    user.find({}, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};
//exports.getUserbyUsername = function (req, res) {
//    var username = req.params.name
//    console.log(username)
//    var pass = req.params.pass
//    console.log("*******"+username) 
//    console.log("**********"+pass)
//    user.find({
//       Username: username, Password: pass
//    }, function (err, user) {
//    //    console.log(req.params.name);
//       if (err)
//           res.send(err);
//       console.log(user);
//       res.json(user);
//      });
//};
exports.getUserbyUsername = function (req, res) {
    var username = req.params.name;
    console.log(username);
    var pass = req.params.value;
    console.log(pass);
    user.find({
        Username: username, Password: pass
    }, function (err, user) {
        if (err)
            res.send(err);
        console.log(user);
        res.json(user);
    });
};
//# sourceMappingURL=uLoginController.js.map