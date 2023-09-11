import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme'; // Make sure you import your theme tokens
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Header from 'components/Header';

const EarningReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // Use your theme's colors

  const [payments, setpayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/payments')
      .then(response => {
        const newpayments = response.data.map(payment => ({
          ...payment,
          name: `${payment.firstName} ${payment.lastName}`,
        }));
        setpayments(newpayments);
      })
      .catch(error => console.error(`There was an error retrieving the payments: ${error}`));
  }, []);

  const groupedPayments = payments.reduce((acc, payment) => {
    const projectId = payment.project._id;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(payment);
    return acc;
  }, {});

  const calculateTotalRevenue = (payments) => {
    return payments.reduce((acc, payment) => payment.cashin === 1 ? acc + payment.amount : acc - payment.amount, 0);
  };

  const columns = [
    {
      field: 'type', 
      headerName: 'Type', 
      flex: 1,
      renderCell: (params) => (
        <>
          {params.value === 'Cashin' ? (
            <>
              <ArrowUpwardIcon style={{ color: 'green' }} />
              Cashin
            </>
          ) : (
            <>
              <ArrowDownwardIcon style={{ color: 'red' }} />
              Cashout
            </>
          )}
        </>
      ),
    },
    { field: 'toFrom', headerName: 'To/From', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="EARNING REPORTS" subtitle="Showing earnings for each projects" />
      <Box
        m="40px 0 0 0"
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
      {Object.keys(groupedPayments).map((projectId) => {
        const projectPayments = groupedPayments[projectId];
        const projectName = projectPayments[0].project.projectName;
        const rows = projectPayments.map((payment, index) => ({
          id: index,
          type: payment.cashin === 1 ? 'Cashin' : 'Cashout',
          toFrom: payment.customer ? payment.customer.firstName : payment.vendor ? payment.vendor.name : 'N/A',
          amount: payment.amount,
          description: payment.description,
          date: new Date(payment.date).toLocaleDateString(),
        }));

        return (
            <Box key={projectId} mb={4}>
              <Typography variant="h5" style={{ color: colors.greenAccent[300] }}>{projectName}</Typography>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                disableColumnMenu
                disableColumnSelector
              />
              <Typography variant="h6" style={{
                color: colors.grey[100],
                fontSize: '1.2rem', 
                textAlign: 'right',  
              }}>
                Total Revenue: {calculateTotalRevenue(projectPayments)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EarningReport;
