import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Typography, Paper, Grid, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { tokens } from "../../theme";

const Chat1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const { id } = useParams(); // Get the user ID from the route
  const currentUserIndex = parseInt(id);
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


  return (
    <Box m="20px">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">Chat</Typography>
        </Grid>
      </Grid>
      <Paper>
        <Grid container sx={{ height: "87vh" }}>
          <Grid item xs={3} sx={{ borderRight: "1px solid #e0e0e0" }}>
            <List>
            {users && users.length > 0 &&
              <ListItem button key={users[0].id}>
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
              <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
            </Grid>
            <Divider />
            <List>
            {users && users.length > 0 && users.map(user =>
            {
              if (user.id !== currentUserIndex) {
               return (<ListItem button key={user.id}>
                <ListItemIcon>
                 <Avatar
                    alt={user.name}
                    src={user.avatar}
                  />
                </ListItemIcon>
                <ListItemText primary={user.name}></ListItemText>
              </ListItem>)
                }
            }
            )

            }

            </List>
          </Grid>
          <Grid item xs={9}>
            <List sx={{ height: "77vh", overflowY: "auto" }}>
              {/* Message List */}
              <ListItem key="1">
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText align="right" primary="Hey man, What's up ?"></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText align="right" secondary="09:30"></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem key="2">
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText align="left" secondary="09:31"></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem key="3">
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText align="right" secondary="10:30"></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            <Divider />
            <Grid container sx={{ padding: "20px" }}>
              <Grid item xs={10}>
                <TextField id="outlined-basic-email" label="Type Something" fullWidth />
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
                  <SendIcon />
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
