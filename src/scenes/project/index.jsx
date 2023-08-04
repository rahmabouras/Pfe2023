import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { mockDataContacts } from "../../data/mockData";

const Project = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Project Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
    },
    {
      field: "startdate",
      headerName: "Start Date",
      flex: 1,
    },
    {
      field: "duedate",
      headerName: "Due Date",
      flex: 1,
    },
    {
      field: "overallprogress",
      headerName: "Overall Progress",
      flex: 1,
    },
    {
      field: "projectvalue",
      headerName: "Project Value",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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
        <DataGrid checkboxSelection rows={mockDataContacts} columns={columns} />
      </Box>
    </Box>
  );
};

export default Project;
