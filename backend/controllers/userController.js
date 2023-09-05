const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
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

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if the role is 'admin'
      if (decodedToken.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Only admin can create users' });
      }

      const id = await getNextSequence('user');
      const { password } = req.body;

      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        _id: id,
        ...req.body,
        password: hashedPassword // Storing the hashed password
      });

      res.status(201).json(newUser);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', message: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    let updateData = req.body;
    
    // Check if the password is being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
    
  } catch (error) {
    res.status(500).json({ error: 'Error updating user', message: error.message });
  }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
