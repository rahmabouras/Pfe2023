const Event = require('../models/Event');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name'); // Populate createdBy field with name only
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name'); // Populate createdBy field with name only
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
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



// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const id = await getNextSequence('event');
    const newEvent = await Event.create({ _id: id, ...req.body });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event', message: error.message  });
  }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event', message: error.message });
  }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found', message: error.message });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
};
