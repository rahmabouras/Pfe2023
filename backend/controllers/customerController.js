const Customer = require('../models/Customer');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

const AutoIncrement = require('../models/AutoIncrement');

// Get the next sequence number for customers
const getNextSequence = async (name) => {
  const result = await AutoIncrement.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const id = await getNextSequence('customer');
    const newCustomer = await Customer.create({ _id: id, ...req.body });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer', message: error.message });
  }
};

  

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating customer' });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer' });
  }
};
