const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  customer: {
    type: Number,
    ref: 'Customer',
    required: true
  },
  manager: {
    type: Number,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  overallProgress: {
    type: Number,
    default: 0
  },
  projectValue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Closed', 'Done', 'On Hold', 'Cancelled'],
    default: 'Planned'
  },
  bic: {
    type: String,
    required: false
  },

});


const Project = mongoose.model('Project', projectSchema);
module.exports = Project;