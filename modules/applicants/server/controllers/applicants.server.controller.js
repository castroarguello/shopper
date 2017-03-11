'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Applicant = mongoose.model('Applicant'),
  Status = mongoose.model('Status'),
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
      statusChange('new', applicant, req.user);
      res.jsonp(applicant);
    }
  });
};

/*
 * Create a workflow status change record
 */
function statusChange(from, applicant, user) {
  if (from === applicant.status) {
    return;
  }
  var status = new Status({
    application: applicant._id,
    week: moment().isoWeek(),
    from: from,
    status: applicant.status,
    user: user._id
  });
  console.log('statusChange', status);
  status.save();
}

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
  var from = applicant.status;

  applicant = _.extend(applicant, req.body);

  applicant.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      statusChange(from, applicant, req.user);
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
  var filters = {
    week: { $gt: 0 }
  };
  if (req.query.start_date || req.query.end_date) {
    filters.created = {};
    if (req.query.start_date) {
      filters.created.$gt = new Date(req.query.start_date);
    }
    if (req.query.end_date) {
      filters.created.$lt = new Date(req.query.end_date + ' 23:59:59');
    }
  }

  var response = {};
  var o = { query: filters };
  o.map = function () { emit(this.week, this.status) };
  o.reduce = function (k, vals) {
    var reducedObject = {};
    if (vals && vals.length && vals.forEach) {
      vals.forEach(function(val) {
        if (!reducedObject[val]) {
          reducedObject[val] = 0;
        }
        reducedObject[val]++;
      });
    }
    return reducedObject;
  };

  Status
    .mapReduce(o, function (err, results, stats) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        response = results.reduce(function(obj, d) {
            var weekId = [
              moment().isoWeek(d._id).day(1).format('YYYY-MM-DD'),
              moment().isoWeek(d._id).day(6).format('YYYY-MM-DD')
            ].join('-');
            obj[weekId] = d.value;
            return obj;
          }, {});
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
