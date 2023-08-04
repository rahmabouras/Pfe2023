const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
    }
  });


const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
