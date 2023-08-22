const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socketio_chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

  const messageSchema = new mongoose.Schema({
    room: String,
    content: String,
    sender: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Message = mongoose.model('Message', messageSchema);
  




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

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
