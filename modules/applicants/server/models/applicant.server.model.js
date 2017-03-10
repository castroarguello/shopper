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
  lastname: {
    type: String,
    default: '',
    required: 'Please fill Applicant last name',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please fill Applicant phone',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Applicant email',
    trim: true
  },
  zipcode: {
    type: String,
    default: '',
    required: 'Please fill Applicant zipcode',
    trim: true
  },
  referral: {
    type: String,
    default: '',
    required: 'Please fill Applicant referral',
    trim: true
  },
  status: {
    type: String,
    default: 'applied',
    required: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Applicant', ApplicantSchema);

/**
 * Status Schema
 */
var StatusSchema = new Schema({
  application: {
    type: Schema.ObjectId,
    required: 'application ID is required'
  },
  from: {
    type: String,
    default: '',
    required: 'Please fill Status name',
    trim: true
  },
  status: {
    type: String,
    default: '',
    required: 'Please fill Status machine name',
    trim: true
  },
  week: {
    type: Number,
    default: 0
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

mongoose.model('Status', StatusSchema);
