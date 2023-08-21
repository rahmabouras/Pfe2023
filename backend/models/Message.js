const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true,
      },
    conversationId: [{ type: Number, ref: 'Conversation' }],
    senderId: [{ type: Number, ref: 'User' }],
    content: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;