'use strict';
module.exports = function (app) {
    var committeeList = require('../controllers/');
    app.route('/committee')
        .get(committeeList.getAllCommitteeMembers)
        .post(committeeList.CreateCommitteeMember);
    app.route('/committee/:')
        .get(committeeList.getContactbyId);
};
//# sourceMappingURL=SystemUserRoutes.js.map