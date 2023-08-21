const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true,
      },
      participants: [{ type: Number, ref: 'User' }],
      messages: [{ type: Number, ref: 'Message' }],
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;