const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: false,
  },
  createdBy: {
    type: Number,
    ref: 'User',
    required: true,
  },
});


const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
