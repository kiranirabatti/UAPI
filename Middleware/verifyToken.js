var jwt = require('jsonwebtoken');
var config = require('../Config');
exports.validate = function (req, res, next) {
    console.log(req);
    var token = req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({ "error": true });
            }
            req.decoded = decoded;
            next(); //no error, proceed
        });
    }
    else {
        // forbidden without token
        return res.status(403).send({
            "error": true
        });
    }
};
//# sourceMappingURL=verifyToken.js.map