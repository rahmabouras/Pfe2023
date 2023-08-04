const mongoose = require('mongoose');
const fs = require('fs');
import faker from 'faker';

// Replace 'your-mongodb-connection-string' with your actual MongoDB connection string
const MONGODB_URI = 'your-mongodb-connection-string';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your Mongoose schemas and models here (Customer, Vendor, User, Project, Payment, Contact, Event)

// Customer Schema and Model
const customerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  address: String,
});

const Customer = mongoose.model('Customer', customerSchema);

// Vendor Schema and Model
// Define the Vendor schema and model in a similar manner as the Customer schema

// User Schema and Model
// Define the User schema and model in a similar manner as the Customer schema

// Project Schema and Model
// Define the Project schema and model in a similar manner as the Customer schema

// Payment Schema and Model
// Define the Payment schema and model in a similar manner as the Customer schema

// Contact Schema and Model
// Define the Contact schema and model in a similar manner as the Customer schema

// Event Schema and Model
// Define the Event schema and model in a similar manner as the Customer schema

async function createTestData() {
  try {
    // Create test data for Customer
    const customerData = [];
    for (let i = 0; i < 10; i++) {
      const customer = {
        name: faker.company.companyName(),
        phoneNumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
      };
      customerData.push(customer);
    }
    await Customer.insertMany(customerData);

    // Create test data for Vendor
    // ... (similar approach)

    // Create test data for User
    // ... (similar approach)

    // Create test data for Project
    // ... (similar approach)

    // Create test data for Payment
    // ... (similar approach)

    // Create test data for Contact
    // ... (similar approach)

    // Create test data for Event
    // ... (similar approach)

    console.log('Test data created and saved to the database.');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    // Close the database connection after creating test data
    mongoose.connection.close();
  }
}

// Call the function to create test data
createTestData();
