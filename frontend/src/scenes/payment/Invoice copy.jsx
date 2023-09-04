import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';

const Invoice = ({ invoiceData }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Invoice
      </Typography>
      <Typography variant="h6" gutterBottom>
        From: {invoiceData.from}
      </Typography>
      <Typography variant="h6" gutterBottom>
        To: {invoiceData.to}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData.items.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">${item.price}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell align="right">${item.price * item.qty}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="right">${invoiceData.total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Invoice;
