const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  customer: {
    type: Number,
    ref: 'Customer',
    required: false
  },
  vendor: {
    type: Number,
    ref: 'Vendor',
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  cashin: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: Number,
    ref: 'Project',
    required: true
  }
});


const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;