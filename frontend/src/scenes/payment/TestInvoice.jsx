import React from 'react'
import Invoice from './Invoice'


const TestInvoice = () => {
  return (
    <Invoice
      invoiceReference="Référence facture"
      driver={{
        getCompanyName: 'Société VTC',
        getUserId: 'Référence client',
        getFirstName: 'Prénom',
        getLastName: 'NOM',
        getAddress: 'adresse',
        getZipCode: 'code postal',
        getCity: 'VILLE'
      }}
      start="start date"
      end="end date"
      summaryDriverClientsPayment={{ mysamHT: '0,00€', mysamTTC: '0,00€' }}
      summaryDriverPayment={{ mysamHT: '0,00€', mysamTTC: '0,00€' }}
      summaryPenalties={{ driverHT: '0,00€', driverTTC: '0,00€' }}
      totalHT="0,00€"
      totalTVA="0,00€"
      totalTTC="0,00€"
    />
  )
}

export default TestInvoice