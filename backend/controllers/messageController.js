const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching message' });
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

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const id = await getNextSequence('message');
    const newMessage = await Message.create({ _id: id, ...req.body });
    const { sender, content, conversationId } = req.body;
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push({ sender, content, timestamp: new Date() });
    await conversation.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error creating message' });
  }
};

// Update a message by ID
exports.updateMessage = async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
};
