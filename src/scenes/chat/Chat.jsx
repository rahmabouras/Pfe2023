import React, {useContext, useEffect, useRef, useState} from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, useTheme, Divider, Avatar, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import Logo from "./Logo";
import {UserContext} from "./UserContext.jsx";
import axios from "axios";
import Contact from "./Contact";
import {uniqBy} from "lodash";
import { tokens } from '../../theme';
const Chat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  // Example list of people to chat with
  const people = ['Alice', 'Bob', 'Charlie', 'David'];

  const handleSendMessage = () => {
    if (currentMessage.trim() !== '') {
      setMessages([...messages, { text: currentMessage, sender: 'User' }]);
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChatSelection = (person) => {
    setActiveChat(person);
    // Optionally clear the messages or load the conversation history with this person
  };

  const [ws,setWs] = useState(null);
  const [onlinePeople,setOnlinePeople] = useState({});
  const [offlinePeople,setOfflinePeople] = useState({});
  const [selectedUserId,setSelectedUserId] = useState(null);
  const [newMessageText,setNewMessageText] = useState('');
  const [messages,setMessages] = useState([]);
  const {username,id,setId,setUsername} = useContext(UserContext);
  const divUnderMessages = useRef();
  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);
  function connectToWs() {
    const ws = new WebSocket('ws://localhost:4040');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect.');
        connectToWs();
      }, 1000);
    });
  }
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({userId,username}) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ev,messageData});
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, {...messageData}]));
      }
    }
  }
  function logout() {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText('');
      setMessages(prev => ([...prev,{
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  }
  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/'+selectedUserId).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = {...onlinePeople};
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');


  return (
    <Box sx={{ display: 'flex', height: '890px' }}>
      <Box sx={{ width: '33%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}>
            <Logo />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Chat
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
          <List>
            {/* ... (same code for rendering people list) */}
          </List>
        </Box>
        <Divider />
      </Box>
      <Box sx={{ width: '67%', padding: '8px', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        {/* Messages go here */}
        <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
          {/* Map through messages and render */}
          {/* ... */}
        </Box>
        <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <TextField
          variant="outlined"
          fullWidth
          value={newMessageText}
          onChange={ev => setNewMessageText(ev.target.value)}
          placeholder="Type your message here"
          sx={{ height: '48px' }}
        />
        <IconButton
          component="label"
          color="primary"
          sx={{ height: '48px', width: '48px' }}
        >
          <AttachFileIcon />
          <input type="file" hidden onChange={sendFile} />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          endIcon={<SendIcon />}
          sx={{ height: '48px' }}
        >
          Send
        </Button>
      </Box>

      </Box>
    </Box>
  );
};

export default Chat;
