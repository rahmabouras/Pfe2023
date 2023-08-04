const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  }
});


const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
