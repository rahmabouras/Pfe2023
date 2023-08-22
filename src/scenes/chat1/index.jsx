import React, { useState, useEffect } from "react";
import axios from 'axios';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import { Box, useTheme, Typography, Paper, Grid, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, IconButton } from "@mui/material";
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
  const [focusedUser, setFocusedUser] = useState(null); 
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: currentUserIndex <= parseInt(selectedUser) ?  "conv"+currentUserIndex+"with"+selectedUser : "conv"+selectedUser+"with"+currentUserIndex,
        author: users[0].id,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    // Existing receive_message handler
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  
    // New handler for old messages
    socket.on("old_messages", (data) => {
      setMessageList(data);
      console.log("old_messages", data);
    });
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
              console.log(mappedUsers);
          })
          .catch(error => {
              console.error("An error occurred while fetching user data:", error);
          });
  }, []);


  const handleUserClick = async (user) => {
    setFocusedUser(user);
    setSelectedUser(user.id);
    await socket.emit("join_room", currentUserIndex <= parseInt(selectedUser) ?  "conv"+currentUserIndex+"with"+selectedUser : "conv"+selectedUser+"with"+currentUserIndex);
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
                                  <ListItemText align={currentUserIndex === message.author ? "right" : "left"} primary={message.message}></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                  <ListItemText align={currentUserIndex === message.author ? "right" : "left"} secondary={message.time}></ListItemText>
                                </Grid>
                              </Grid>
                            </ListItem>
            )
                
                
                )}

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
                <IconButton color="secondary" aria-label="attach-file" sx={{
                    fontSize: "14px",
                    margin: "5px",
                    }}>
                  <AttachFileIcon />
                </IconButton>
                <Fab color="primary" aria-label="add"   sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    padding: "10px 20px",
                    margin: "5px",
                }}>
                  <SendIcon onClick={sendMessage}/>
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Chat1;
