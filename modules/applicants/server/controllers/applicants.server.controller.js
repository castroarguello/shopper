'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Applicant = mongoose.model('Applicant'),
  Workflow = mongoose.model('Workflow'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Applicant
 */
exports.create = function(req, res) {
  var applicant = new Applicant(req.body);
  applicant.user = req.user;

  applicant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};

/**
 * Show the current Applicant
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var applicant = req.applicant ? req.applicant.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // applicant.isCurrentUserOwner = req.user && applicant.user && applicant.user._id.toString() === req.user._id.toString();
  applicant.isCurrentUserOwner = true;

  res.jsonp(applicant);
};

/**
 * Update a Applicant
 */
exports.update = function(req, res) {
  var applicant = req.applicant;

  applicant = _.extend(applicant, req.body);

  applicant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};

/**
 * Delete an Applicant
 */
exports.delete = function(req, res) {
  var applicant = req.applicant;

  applicant.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicant);
    }
  });
};

/**
 * List of Applicants
 */
exports.list = function(req, res) {
  Applicant.find().sort('-created').populate('user', 'displayName').exec(function(err, applicants) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicants);
    }
  });
};

/**
 * Applications Funnel
 */
exports.funnels = function(req, res) {
  Workflow.find().sort('-created').exec(function(err, workflows) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var response = workflows.map(function(d){
        return {
          count: 0,
          status: d.id,
          label: d.name,
        }
      });
      res.jsonp(response);
    }
  });
};

/**
 * Applicant middleware
 */
exports.applicantByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Applicant is invalid'
    });
  }

  Applicant.findById(id).populate('user', 'displayName').exec(function (err, applicant) {
    if (err) {
      return next(err);
    } else if (!applicant) {
      return res.status(404).send({
        message: 'No Applicant with that identifier has been found'
      });
    }
    req.applicant = applicant;
    next();
  });
};
