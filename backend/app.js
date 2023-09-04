const express = require("express");
const bodyParser = require('body-parser');
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const mongoose = require("mongoose");

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
mongoose.connect('mongodb://localhost:27017/project_management_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});


// Import the models
const Customer = require('./models/Customer');
const Vendor = require('./models/Vendor');
const User = require('./models/User');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const Project = require('./models/Project');
const Issue = require('./models/Issue');
const Payment = require('./models/Payment');
const Contact = require('./models/Contact');
const Event = require('./models/Event');

// Define routes for each schema
const customerRoutes = require('./routes/customerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
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
  });
  
  

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Server listener
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
