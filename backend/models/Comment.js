const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  issueId: [{ type: Number, ref: 'Project' }],
  userId: [{ type: Number, ref: 'User' }],
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
