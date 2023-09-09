const Comment = require('../models/Comment');
const Issue = require('../models/Issue');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('userId');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate('userId');
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const AutoIncrement = require('../models/AutoIncrement');
// Get the next sequence number
const getNextSequence = async (name) => {
  const result = await AutoIncrement.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

const createComment = async (req, res) => {
  try {
    const id = await getNextSequence('comment');
    // Create the new Comment
    const newComment = new Comment({ _id: id, ...req.body });

    // Save the new Comment
    await newComment.save();

    // Associate the Comment with the Project
    const issueToUpdate = await Issue.findById(req.body.issueId);
    issueToUpdate.comments.push(newComment._id);
    await issueToUpdate.save();

    res.json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  createComment
};


const updateComment = async (req, res) => {
  try {
    const updatedCommment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCommment) {
      return res.status(404).json({ error: 'Commment not found' });
    }
    res.status(200).json(updatedCommment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating comment', message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
