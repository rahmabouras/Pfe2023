import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import { Box, useTheme, Typography, Paper, Grid, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const socket = io.connect("http://localhost:3001");

const Chat1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const { id } = useParams(); // Get the user ID from the route
  const currentUserIndex = parseInt(id);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);


  const sendMessage = async (filename) => {
    if (currentMessage !== "" || selectedFile) {
      const messageData = {
        room: currentUserIndex <= parseInt(selectedUser)
          ? "conv" + currentUserIndex + "with" + selectedFile
          : "conv" + selectedUser + "with" + currentUserIndex,
        author: users[0].id,
        message: selectedFile ? selectedFile.name :currentMessage,
        file: selectedFile ? `/uploads/${filename}` : null, // Include file path if available
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
  
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, {...messageData, id: Date.now()}]);
      console.log(messageList)
      setCurrentMessage("");
      setSelectedFile(null); // Clear selected file
    }

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  

  useEffect(() => {
    // Existing receive_message handler
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  
    // New handler for old messages
    socket.on("old_messages", (data) => {
      setMessageList(data);
      console.log("old_messages", data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => { // Clean up listeners when the component unmounts
        socket.off("receive_message");
        socket.off("old_messages");
    };
  }, [socket]);



  useEffect(() => {
      // Fetch users from the backend
      axios.get('http://localhost:3000/api/users')
          .then(response => {
              // Map the response data to the desired structure
              const mappedUsers = response.data.map(user => ({
                  id: user._id,
                  name: user.firstName,
                  avatar: user.avatar
              }));
  
              // Find the index of the user with the ID matching currentUserIndex
              const currentUserIndexInArray = mappedUsers.findIndex(user => user.id === currentUserIndex);
  
              // If the user is found, move them to the beginning of the array
              if (currentUserIndexInArray !== -1) {
                  const currentUser = mappedUsers.splice(currentUserIndexInArray, 1)[0];
                  mappedUsers.unshift(currentUser);
              }
  
              setUsers(mappedUsers);
              handleUserClick(mappedUsers[1])
              console.log(mappedUsers[1].id);
          })
          .catch(error => {
              console.error("An error occurred while fetching user data:", error);
          });
  }, []);


  const handleUserClick = (user) => {
    setSelectedUser(user.id);
    setMessageList([]);
    const roomName = currentUserIndex <= parseInt(user.id) ? "conv" + currentUserIndex + "with" + user.id : "conv" + user.id + "with" + currentUserIndex;
    socket.emit("join_room", roomName);
  };
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
// State to hold the selected file
const [selectedFile, setSelectedFile] = useState(null);

// Function to handle file selection
const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      handleOpen();
    }
  };
  
  const handleSend = () => {
    handleFileUpload(); // Call the function to actually upload the file
    handleClose(); // Close the dialog
  };
  

// Function to handle file upload
const handleFileUpload = () => {
    if (selectedFile) {
      // Append current date to the original file name
      const currentDate = Date.now();
      const ext = selectedFile.name.substr(selectedFile.name.lastIndexOf('.'));
      const nameWithoutExt = selectedFile.name.substr(0, selectedFile.name.lastIndexOf('.'));
      const newName = `${nameWithoutExt}-${currentDate}${ext}`;
  
      // Create a new Blob with the same content as the selected file
      const newFile = new Blob([selectedFile], { type: selectedFile.type });
  
      // Create FormData and append the new Blob with the new name
      const formData = new FormData();
      formData.append("file", newFile, newName);
  
      axios.post("http://localhost:3001/upload", formData).then((response) => {
        console.log("File uploaded successfully");
        // You can further process the response as needed
        sendMessage(newName);
      });
    }
  };
  

  // Function to handle file download
  const handleFileDownload = (fileUrl) => {
    const url = `http://localhost:3001${fileUrl}`; // Update the URL to point to your server
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file"); // You might want to use the actual file name here
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  


  return (
    <Box m="20px">
        <Header
        title="Chat"
        subtitle="Chat with the Team"
      />
      <Paper sx={{ backgroundColor: theme.palette.background.default }}>
        <Grid container sx={{ height: "78vh" }}>
          <Grid item xs={3} sx={{ borderRight: "1px solid #e0e0e0" ,height: "78vh" }}>
            <List>
            {users && users.length > 0 &&
              <ListItem key={users[0].id}>
                <ListItemIcon>
                  <Avatar
                    alt={users[0].name}
                    src={users[0].avatar}
                  />
                </ListItemIcon>
                <ListItemText primary={users[0].name}></ListItemText>
              </ListItem>
            }
            </List>
            <Divider />
            <Grid item xs={12} sx={{ padding: "10px" }}>
            <TextField
                id="outlined-basic-email"
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                />

            </Grid>
            <Divider />
            <List>
            {users && users.length > 0 &&
                users
                .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((user) => {
                    if (user.id !== currentUserIndex) {
                    return (
                        <ListItem
                        button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        sx={{
                            backgroundColor: user.id === selectedUser ? colors.blueAccent[700] : "transparent", // Highlighting logic
                            '&:hover': {
                              backgroundColor: user.id === selectedUser ? colors.blueAccent[700] : "rgba(0, 0, 0, 0.08)",
                            },
                          }}
                        >
                        <ListItemIcon>
                            <Avatar alt={user.name} src={user.avatar} />
                        </ListItemIcon>
                        <ListItemText primary={user.name}></ListItemText>
                        </ListItem>
                    );
                    }
                    return null;
                })
                }

            </List>
          </Grid>
          <Grid item xs={9}>
            <List sx={{ height: "68vh", overflowY: "auto" }}>
              {/* Message List */}
                        {messageList && messageList.length > 0 && messageList.map(message => (
                              <ListItem key={message.id}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <ListItemText align={currentUserIndex === parseInt(message.author) ? "right" : "left"} primary={message.file ? "" : message.message}></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                <ListItemText align={currentUserIndex === parseInt(message.author) ? "right" : "left"} secondary={message.time}>{message.file && (
                                    (message.file.toLowerCase().endsWith(".jpg") || message.file.toLowerCase().endsWith(".jpeg") || message.file.toLowerCase().endsWith(".png")) ?
                                    <img src={`http://localhost:3001${message.file}`} alt="attachment" style={{ maxWidth: "200px" }} />
                                    :
                                    <a href="#" onClick={() => handleFileDownload(message.file)}>{message.message}</a>
                                    )}
                                </ListItemText>


                                </Grid>
                                
                              </Grid>
                            </ListItem>
            )
                
                
                )}
                <div ref={messagesEndRef} />
            </List>
            <Divider />
            <Grid container sx={{ padding: "20px" }}>
              <Grid item xs={10}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                type="text"
                value={currentMessage || ''} // Add this change
                placeholder="Hey..."
                onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                }} fullWidth />

              </Grid>
              <Grid item xs={2} align="right">
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <label htmlFor="fileInput">
                    <IconButton
                    color="secondary"
                    aria-label="attach-file"
                    component="span"
                    sx={{
                        fontSize: "14px",
                        margin: "5px",
                    }}
                    >
                    <AttachFileIcon />
                    </IconButton>
                </label>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    padding: "10px 20px",
                    margin: "5px",
                    }}
                >
                    <SendIcon onClick={sendMessage} />
                </Fab>
                </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Paper>

            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Do you want to send this file?"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            You will not be able to undo the send of this file.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} sx={{
            color: colors.grey[100],
            fontSize: "14px",
            padding: "10px 20px",
            }}>
            No
            </Button>
            <Button onClick={handleSend} sx={{
            color: colors.grey[100],
            fontSize: "14px",
            padding: "10px 20px",
            }} autoFocus>
            Yes
            </Button>
        </DialogActions>
        </Dialog>

    </Box>
  );
};

export default Chat1;
