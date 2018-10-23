module.exports = function (app) {
    var userList = require('../controllers/uLoginController');
    // todoList Routes
    var cors = require('cors');
    app.use(cors());
    app.route('/sysUser')
        .post(userList.createUser)
        .get(userList.getAllUsers);
    app.route('/sysUser/:name&:value')
        .get(userList.getUserbyUsername);
};
//# sourceMappingURL=uLoginRoutes.js.map