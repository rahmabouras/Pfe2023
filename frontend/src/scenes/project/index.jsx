import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Project = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const handleEditClick = (id) => {
    navigate(`/project/${id}`);
  };
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        const newProjects = response.data.map(project => ({
          ...project,
          name: `${project.firstName} ${project.lastName}`,
          customer: `${project.customer.firstName} ${project.customer.lastName}`,
          manager: `${project.manager.firstName} ${project.manager.lastName}`,
          startDate: project.startDate.slice(0, 10),
          dueDate: project.dueDate.slice(0, 10)
        }));
        console.log(newProjects);
        setProjects(newProjects);
      })
      .catch(error => console.error(`There was an error retrieving the projects: ${error}`));
  }, []);
  

  const handleClickOpen = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/projects/${selectedId}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        
        setProjects(projects.filter((project) => project._id !== selectedId));  // removing the deleted project
      });
    setOpen(false);
  };


  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    {
      field: "projectName",
      headerName: "Project Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "bic",
      headerName: "BIC",
      flex: 1,
    },
    {
      field: "customer",
      headerName: "Customer Name",
      flex: 1,
    },
    {
      field: "manager",
      headerName: "Manager Name",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
    },
    {
      field: "projectValue",
      headerName: "Project Value",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "overallProgress",
      headerName: "Overall Progress",
      flex: 1,
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
      <Header title="Projects" subtitle="Managing Projects" />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {/* Add Project Button */}
        <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
            LinkComponent={Link}
            to="/addproject"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add Project
          </Button>
        </Box>

        {/* DataGrid */}
        <DataGrid
          rows={projects}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
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

export default Project;
