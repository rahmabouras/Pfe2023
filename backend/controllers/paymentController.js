const Payment = require('../models/Payment');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('project', 'customer'); // Populate project field with customer only
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

// Get a payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('project', 'customer'); // Populate project field with customer only
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
  }
};

const AutoIncrement = require('../models/AutoIncrement');

// Get the next sequence number
const getNextSequence = async (name) => {
  const result = await AutoIncrement.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};



// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const id = await getNextSequence('payment');
    const newPayment = await Payment.create({ _id: id, ...req.body });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating payment' });
  }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment' });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting payment' });
  }
};
