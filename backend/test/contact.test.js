const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const connectDB = require('../db'); // Import your DB connection function
const app = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Contacts API', function() {

  before(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await connectDB('mongodb://localhost:27017/project_management_system_test');
      }
      console.log('Test DB connected');
    } catch (err) {
      console.error('Connection error', err);
    }
  });

  after(async () => {
    try {
      await mongoose.disconnect();
      console.log('Test DB disconnected');
    } catch (err) {
      console.error('Disconnection error', err);
    }
  });

  it('should get all contacts', function(done) {
    chai.request(app)
      .get('/api/contacts')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
