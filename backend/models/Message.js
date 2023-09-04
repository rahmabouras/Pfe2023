const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    room: String,
    content: String,
    file: String,
    sender: [{ type: Number, ref: 'User' }],
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;