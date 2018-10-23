'use strict';
//var verifyToken = require('../../Middleware/verifyToken');
var jwt = require('jsonwebtoken');
var config = require('../../Config');

module.exports = function (app) {
	var committeeList = require('../controllers/committeeListController');
	var login = require('../controllers/LoginController');
	var cors = require('cors')
	app.use(cors());

	app.use(function (req, res, next) {
		if (req.originalUrl == '/login/admin@scriptshub.net&admin') {
			next();
		}
		else if (req.originalUrl == '/image.png') {
			next();
		}
		else {
			var token = req.headers['x-access-token'];
			if (token) {
				jwt.verify(token, config.secret, function (err, decoded) {
					if (err) {
						return res.status(401).send('Invalid token');
					}
					req.decoded = decoded;
					next();
				});
			}
			else {				
				return res.status(404).send('Token missing');
			}
		}
	});

	app.route('/committee')
		.get(committeeList.getAllUsers)
		.post(committeeList.CreateUser);

	app.route('/committee/:UserId')
		.get(committeeList.getUserbyId)
		.put(committeeList.updateUser)
		.delete(committeeList.deleteUser);

	app.route('/UserSearch/:Name')
		.get(committeeList.searchUserbyName);

	app.route('/image.png')
		.get(committeeList.getImage);

	app.route('/UserSearch/:fieldName/:searchValue')
		.get(committeeList.searchUser)

	app.route('/login/:emailId&:password')
		.get(login.userLogin)

	app.route('/eventManagement')
		.get()
		.post()

} 