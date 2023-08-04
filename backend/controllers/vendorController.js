const Vendor = require('../models/Vendor');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vendors' });
  }
};

// Get a vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vendor' });
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

// Create a new vendor
exports.createVendor = async (req, res) => {
  try {
    const id = await getNextSequence('vendor');
    const newVendor = await Vendor.create({ _id: id, ...req.body });
    res.status(201).json(newVendor);
  } catch (error) {
    res.status(500).json({ error: 'Error creating vendor' });
  }
};

// Update a vendor by ID
exports.updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    res.status(500).json({ error: 'Error updating vendor' });
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting vendor' });
  }
};
