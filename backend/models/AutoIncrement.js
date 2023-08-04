// AutoIncrement.js
const mongoose = require('mongoose');

const autoIncrementSchema = new mongoose.Schema({
  _id: String,
  seq: Number
});

const AutoIncrement = mongoose.model('AutoIncrement', autoIncrementSchema);
module.exports = AutoIncrement;
