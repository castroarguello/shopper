'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Applicant Schema
 */
var ApplicantSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Applicant name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Applicant', ApplicantSchema);
