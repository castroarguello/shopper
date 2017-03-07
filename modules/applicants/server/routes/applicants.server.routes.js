'use strict';

/**
 * Module dependencies
 */
var applicantsPolicy = require('../policies/applicants.server.policy'),
  applicants = require('../controllers/applicants.server.controller');

module.exports = function(app) {
  // Applicants Routes
  app.route('/api/applicants').all(applicantsPolicy.isAllowed)
    .get(applicants.list)
    .post(applicants.create);

  app.route('/funnels.json').all(applicantsPolicy.isAllowed)
    .get(applicants.funnels);

  app.route('/api/applicants/:applicantId').all(applicantsPolicy.isAllowed)
    .get(applicants.read)
    .put(applicants.update)
    .delete(applicants.delete);

  // Finish by binding the Applicant middleware
  app.param('applicantId', applicants.applicantByID);
};
