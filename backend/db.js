// db.js

const mongoose = require("mongoose");

const connectDB = (uri) => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Connection error', err);
  });
};

module.exports = connectDB;
