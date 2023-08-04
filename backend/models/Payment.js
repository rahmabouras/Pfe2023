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
  fromto: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
});


const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
