import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import TestInvoice from "./TestInvoice";
import html2pdf from "html2pdf.js";

const Payment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();
  const handleEditClick = (id) => {
    navigate(`/payment/${id}`);
  };
  const [payments, setpayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);


  useEffect(() => {
    axios.get('http://localhost:5000/api/payments')
      .then(response => {
        const newpayments = response.data.map(payment => ({
          ...payment,
          name: `${payment.firstName} ${payment.lastName}`
        }));
        setpayments(newpayments);
      })
      .catch(error => console.error(`There was an error retrieving the payments: ${error}`));
  }, []);
  

  const handleClickOpen = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/payments/${selectedId}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        
        setpayments(payments.filter((payment) => payment._id !== selectedId));  // removing the deleted payment
      });
    setOpen(false);
  };

  const handlePrintClick = (id) => {
    // Fetch the invoice data here (or just use the existing data you have)
    // Show the invoice dialog
    setInvoiceOpen(true);
  };  

  const handleDownloadInvoice = () => {
    const content = document.getElementById("invoice-content");
    
    const opt = {
      margin: 0,
      filename: 'Invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(content).set(opt).save();
};

  

  const columns = [
    { field: "_id", headerName: "ID" },
    {
      field: "date",
      headerName: "date",
      flex: 1,
    },
    {
      field: "hhh",
      headerName: "Transaction Type",
      flex: 1,
      valueGetter: (params) => {
        return params.row.cashin? "CashIn" : "CashOut";
      },
    },
    {
      field: "cashin",
      headerName: "From/To",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.cashin === 1) {
          return params.row.customer ? `${params.row.customer.firstName} ${params.row.customer.lastName}` : "";
        } else {
          return params.row.vendor ? `${params.row.vendor.firstName} ${params.row.vendor.lastName}` : "";
        }
      },
    },

    
    
    {
      field: "amount",
      headerName: "amount",
      flex: 1,
    },
    {
      field: "description",
      headerName: "description",
      flex: 1,
    },
    {
      field: "project",
      headerName: "project",
      valueGetter: (params) => {
          return params.row.project.projectName;
      },
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div>
            <IconButton aria-label="print" onClick={() => { handlePrintClick(params.row._id) }}>
          <PrintIcon />
            </IconButton>
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
      <Header title="PAYMENTS" subtitle="Managing of payment" />
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
            to="/addpayment"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add payment
          </Button>
        </Box>

        <DataGrid 
          checkboxSelection 
          rows={payments} 
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
        <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="md" >
      <DialogContent>
        {/* Add an ID for the invoice content to easily select it for the PDF conversion */}
        <div id="invoice-content">
          <TestInvoice />
        </div>
      </DialogContent>
  <DialogActions>
    {/* Add a button to download the invoice */}
    <Button onClick={handleDownloadInvoice}             
    sx={{
      color: colors.grey[100],
      fontSize: "14px",
      padding: "10px 20px",
    }}>
      Download
    </Button>
    <Button onClick={() => setInvoiceOpen(false)}             
    sx={{
      color: colors.grey[100],
      fontSize: "14px",
      padding: "10px 20px",
    }}>
      Close
    </Button>
  </DialogActions>
</Dialog>

      </Box>
    </Box>
  );
};

export default Payment;
