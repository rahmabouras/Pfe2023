import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext, useState, useEffect} from "react";
import { ColorModeContext, tokens } from "../../theme";
import axios from "axios";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";


const Topbar = ({socket}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const signOut = useSignOut()
  const [notifications, setNotifications] = useState([]);
  const getUser = useAuthUser();
  const user = getUser();
  const id = user?.user?._id;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const handleOpenNotif = (event) => setNotifAnchorEl(event.currentTarget);
  const handleCloseNotif = () => setNotifAnchorEl(null);


  console.log("notifications hahaha");
  console.log(notifications);

  const handleEditProfile = () => {
    navigate('/updateprofile');
    handleClose();
  };

  const handleLogout = () => {
    signOut();
    navigate('login');
  };

  useEffect(() => {
    socket.on("receive_notif", (data) => {
        console.log("notification received");
        console.log(data);

        const match = data.room.match(/conv(\d+)with(\d+)/);
        if (match) {
            const id1 = parseInt(match[1], 10);
            const id2 = parseInt(match[2], 10);

            const nonAuthorId = id1 !== data.author ? id1 : id2;
            console.log("ID that's not the author:", nonAuthorId);
            
            if(id === nonAuthorId) {
            // Making an Axios call to get the user with that ID
            axios.get(`http://localhost:5000/api/users/${data.author}`)
                .then(response => {
                    const user = response.data;
                    setNotifications(prevNotifications => [...prevNotifications, "New Message from " + user.firstName + " " + user.lastName]);
                })
                .catch(error => {
                    console.error(`There was an error retrieving the user: ${error}`);
                });
              }
        }
    });

    return () => {
        socket.off("receive_notif");
    };
}, [socket]);




  
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpenNotif}>
        <Badge 
    badgeContent={notifications.length}
    sx={{ '.MuiBadge-badge': { backgroundColor: colors.blueAccent[700] } }}
>
    <NotificationsOutlinedIcon />
</Badge>
</IconButton>

      <Menu
          anchorEl={notifAnchorEl}
          keepMounted
          open={Boolean(notifAnchorEl)}
          onClose={handleCloseNotif}
      >
          {notifications.length === 0 ? (
              <MenuItem>No notifications</MenuItem>
          ) : (
              notifications.map((notif, index) => (
                  <MenuItem 
                  key={index} 
                  onClick={() => {
                    navigate(`chat`)
                    setNotifications([])
                    handleCloseNotif()
                  }
                }
                >{notif}</MenuItem>
              ))
          )}
      </Menu>

        <IconButton onClick={handleClick}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
