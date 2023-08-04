const Contact = require('../models/Contact');

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
};

// Get a contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contact' });
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



// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const id = await getNextSequence('contact');
    const newContact = await Contact.create({ _id: id, ...req.body });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact', message: error.message });
  }
};

// Update a contact by ID
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
};
