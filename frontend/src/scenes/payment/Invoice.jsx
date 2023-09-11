import React from 'react';
import './Invoice.css';
import BicLogo from './bic.png'; // Ensure this path is correct.

const Invoice = ({
    invoiceReference,
    driver,
    start,
    end,
    summaryDriverClientsPayment,
    summaryDriverPayment,
    summaryPenalties,
    totalHT,
    totalTVA,
    totalTTC
}) => {
    return (
      <div className='invoice-container'>
        <div className="container ">
            <div className="invoice">
                <div className="row">
                    <div className="col-7">
                        <img src={BicLogo} className="logo" alt="BIC Logo" />
                    </div>
                    <div className="col-5">
                        <h1 className="document-type display-4">FACTURE</h1>
                        <p className="text-right"><strong>{invoiceReference || 'Référence facture'}</strong></p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-7">
                        <p className="addressMySam">
                            <strong>MYSAM</strong><br />
                            8 avenue de la Martelle<br />
                            81150 Terssac
                        </p>
                    </div>
                    <div className="col-5">
                        <br /><br /><br />
                        <p className="addressDriver">
                            <strong>{driver?.getCompanyName || 'Société VTC'}</strong><br />
                            Réf. Client <em>{driver?.getUserId || 'Référence client'}</em><br />
                            <span>{driver?.getFirstName || 'Prénom'}</span> <span>{driver?.getLastName || 'NOM'}</span><br />
                            <span>{driver?.getAddress || 'adresse'}</span><br />
                            <span>{driver?.getZipCode || 'code postal'}</span> <span>{driver?.getCity || 'VILLE'}</span>
                        </p>
                    </div>
                </div>

                <h6>Frais de services MYSAM du <span>{start || 'date'}</span> au <span>{end || 'date'}</span></h6>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>TVA</th>
                            <th className="text-right">Total HT</th>
                            <th className="text-right">Total TTC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Frais de service MySam à 5% pour la période du <span>{start || 'date'}</span> au <span>{end || 'date'}</span></td>
                            <td>20%</td>
                            <td className="text-right">{summaryDriverClientsPayment?.mysamHT || '0,00€'}</td>
                            <td className="text-right">{summaryDriverClientsPayment?.mysamTTC || '0,00€'}</td>
                        </tr>
                        <tr>
                            <td>Frais de service MySam à 10% pour la période du <span>{start || 'date'}</span> au <span>{end || 'date'}</span></td>
                            <td>20%</td>
                            <td className="text-right">{summaryDriverPayment?.mysamHT || '0,00€'}</td>
                            <td className="text-right">{summaryDriverPayment?.mysamTTC || '0,00€'}</td>
                        </tr>
                        <tr>
                            <td>Pénalités d'annulation</td>
                            <td>20%</td>
                            <td className="text-right">{summaryPenalties?.driverHT || '0,00€'}</td>
                            <td className="text-right">{summaryPenalties?.driverTTC || '0,00€'}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="row">
                    <div className="col-8"></div>
                    <div className="col-4">
                        <table className="table table-sm text-right">
                            <tr>
                                <td><strong>Total HT</strong></td>
                                <td className="text-right">{totalHT || '0,00€'}</td>
                            </tr>
                            <tr>
                                <td>TVA 20%</td>
                                <td className="text-right">{totalTVA || '0,00€'}</td>
                            </tr>
                            <tr>
                                <td><strong>Total TTC</strong></td>
                                <td className="text-right">{totalTTC || '0,00€'}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <p className="conditions">
                    En votre aimable règlement
                    <br />
                    Et avec nos remerciements.
                    <br />
                    Conditions de paiement : paiement à réception de facture.
                    <br />
                    Aucun escompte consenti pour règlement anticipé.
                    <br />
                    Règlement par virement bancaire ou carte bancaire.
                    <br />
                    En cas de retard de paiement, indemnité forfaitaire pour frais de recouvrement : 40 euros (art. L.4413 et L.4416 code du commerce).
                </p>

                <p className="bottom-page text-right">
                    MYSAM SAS - N° SIRET 81754802700017 RCS ALBI<br />
                    8, avenue de la Martelle - 81150 TERSSAC 06 32 97 00 22 - www.mysam.fr<br />
                    Code APE 6312Z - N° TVA Intracom. FR 63 817548027<br />
                </p>
            </div>
        </div>
        </div>
    );
}

export default Invoice;
