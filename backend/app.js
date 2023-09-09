const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const connectDB = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Message = require('./models/Message');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined.');
}

// Initialize Express App
const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// HTTP server
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"]
  }
});


// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management_system';
connectDB(mongoUri);






// Define routes for each schema
const customerRoutes = require('./routes/customerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/events', eventRoutes);

// Multer settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, ext);
    cb(null, originalName + ext);
  },
});

const upload = multer({ storage: storage });


const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'avatars/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, ext);
    cb(null, originalName + ext); // Keep the original filename and extension
  },
  
});

// Initialize upload middleware
const uploadAvatar = multer({ storage: storageAvatar });

app.get('/uploads/:filename', function(req, res){
  const file = `uploads/${req.params.filename}`;
  res.download(file); // Set Content-Disposition
});

app.post("/uploadavatar/:userId", uploadAvatar.single("file"), async (req, res) => {
  const userId = req.params.userId;
  const file = req.file;

  if (!file) {
      return res.status(400).send("No file uploaded");
  }

  res.status(200).send({ message: 'Avatar uploaded successfully!' });
});


app.get('/avatars/:userId', function(req, res){
  const file = `avatars/${req.params.userId}.png`;
  res.download(file);
});


// Routes
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }
  res.status(200).send({ filePath: `/uploads/${file.filename}` });
});


// Socket.io logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  
    try {
      const messages = await Message.find({ room: data });
      socket.emit("old_messages", messages.map(message => ({
        id: message.id,
        room: message.room,
        author: message.sender,
        message: message.content,
        file: message.file,
        time: new Date(message.timestamp).getHours() +
              ":" +
              new Date(message.timestamp).getMinutes()
      })));
    } catch (err) {
      console.error('Error retrieving messages', err);
    }
  });

  socket.on("send_message", (data) => {
    const message = new Message({
      room: data.room,
      content: data.message,
      file: data.file, // Include the file field
      sender: data.author // or other user details
    });
  
    message.save()
      .then(() => console.log('Message saved'))
      .catch(err => console.error('Error saving message', err));
  
    socket.to(data.room).emit("receive_message", data);
    io.emit("receive_notif", data);
  });
  
  

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});



app.post('/api/login', async function(req, res) {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });

  // User not found
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Generate and return JWT
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
    if (err) throw err;
    res.json({ token: token , user: user });
  });
});


// Server listener
server.listen(5000, () => {
  console.log("Server running on port 5000");
});


module.exports = app;
