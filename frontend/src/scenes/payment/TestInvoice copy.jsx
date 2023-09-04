import React from 'react'
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Invoice from './Invoice';

const saveAsPDF = () => {
    const input = document.getElementById('invoiceComponent');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save("invoice.pdf");
    });
  }

const invoiceDetails = {
    from: 'ABC Corp.',
    to: 'John Doe',
    items: [
      { name: 'Item 1', price: 10, qty: 2 },
      { name: 'Item 2', price: 20, qty: 1 },
      { name: 'Item 3', price: 15, qty: 4 }
    ],
    total: 95
  };

const TestInvoice = () => {
    return (
    <div style={{ padding: '20px' }}>
      <div id="invoiceComponent">
        <Invoice invoiceData={invoiceDetails} />
      </div>
      <Button variant="contained" color="primary" onClick={saveAsPDF}>
        Download as PDF
      </Button>
    </div>
      );
}

export default TestInvoice