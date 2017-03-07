'use strict';

/**
 * Module dependencies
 */
var workflowsPolicy = require('../policies/workflows.server.policy'),
  workflows = require('../controllers/workflows.server.controller');

module.exports = function(app) {
  // Workflows Routes
  app.route('/api/workflows').all(workflowsPolicy.isAllowed)
    .get(workflows.list)
    .post(workflows.create);

  app.route('/api/workflows/:workflowId').all(workflowsPolicy.isAllowed)
    .get(workflows.read)
    .put(workflows.update)
    .delete(workflows.delete);

  // Finish by binding the Workflow middleware
  app.param('workflowId', workflows.workflowByID);
};
