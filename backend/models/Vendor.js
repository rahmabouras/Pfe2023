const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
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


const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
