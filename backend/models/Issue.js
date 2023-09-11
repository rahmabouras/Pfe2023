const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: String,
  type: String,
  status: String,
  priority: String,
  listPosition: Number,
  description: String,
  descriptionText: String,
  estimate: Number,
  timeSpent: Number,
  timeRemaining: Number,
  start: Date,
  end: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  projectId: [{ type: Number, ref: 'Project' }],
  comments: [{ type: Number, ref: 'Comment' }],
  reporterId: [{ type: Number, ref: 'User' }],
  userIds: [{ type: Number, ref: 'User' }],
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
