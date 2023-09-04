import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, useTheme, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const handleEditClick = (id) => {
    navigate(`/user/${id}`);
  };
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        const newUsers = response.data.map(user => ({
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }));
        console.log(newUsers);
        setUsers(newUsers);
      })
      .catch(error => console.error(`There was an error retrieving the users: ${error}`));
  }, []);
  

  const handleClickOpen = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/users/${selectedId}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        
        setUsers(users.filter((user) => user._id !== selectedId));  // removing the deleted user
      });
    setOpen(false);
  };

  const columns = [
    { field: "_id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin"
                ? colors.greenAccent[600]
                : role === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {role === "manager" && <SecurityOutlinedIcon />}
            {role === "finance" && <LockOpenOutlinedIcon />}
            {role === "employee" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div>
            <IconButton aria-label="edit" onClick={() => { handleEditClick(params.row._id) }}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => { handleClickOpen(params.row._id) }}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      }
    },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Managing of User" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb="20px">
          <Button
            LinkComponent={Link}
            to="/adduser"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add User
          </Button>
        </Box>

        <DataGrid 
          checkboxSelection 
          rows={users} 
          columns={columns} 
          getRowId={(row) => row._id}
        />

        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this item?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You will not be able to recover this item after deletion.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}             
            sx={{
              color: colors.grey[100],
              fontSize: "14px",
              padding: "10px 20px",
            }}>
              No
            </Button>
            <Button onClick={handleDelete}             
            sx={{
              color: colors.grey[100],
              fontSize: "14px",
              padding: "10px 20px",
            }} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Team;
