'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Workflow Schema
 */
var WorkflowSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Workflow name',
    trim: true
  },
  id: {
    type: String,
    default: '',
    required: 'Please fill Workflow machine name',
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

mongoose.model('Workflow', WorkflowSchema);
