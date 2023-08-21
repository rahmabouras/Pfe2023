const Conversation = require('../models/Conversation');

// Get all conversations
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

// Get a conversation by ID
exports.getConversationByUserId = async (req, res) => {
  const { userId } = req.params;
  const conversations = await Conversation.find({ participants: userId });
  res.json(conversations);
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

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const id = await getNextSequence('conversation');
    const newConversation = await Conversation.create({ _id: id, ...req.body });
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating conversation' });
  }
};

// Update a conversation by ID
exports.updateConversation = async (req, res) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(500).json({ error: 'Error updating conversation' });
  }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!deletedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.status(200).json({ conversation: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting conversation' });
  }
};
