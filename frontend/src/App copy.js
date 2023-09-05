import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useIsAuthenticated } from 'react-auth-kit';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import AddContact from "./scenes/contacts/AddContact";
import EditContact from "./scenes/contacts/EditContact";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Customer from "./scenes/customer";
import AddCustomer from "./scenes/customer/AddCustomer";
import AddVendor from "./scenes/vendor/AddVendor";
import Vendor from "./scenes/vendor";
import Project from "./scenes/project";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AddProject from "./scenes/project/AddProject";
import EditCustomer from "./scenes/customer/EditCustomer";
import EditVendor from "./scenes/vendor/EditVendor";
import EditProject from "./scenes/project/EditProject";
import Payment from "./scenes/payment";
import AddPayment from "./scenes/payment/AddPayment";
import EditPayement from "./scenes/payment/EditPayment";
import SignIn from "./scenes/login";
import Chat from "./scenes/chat/";
import AddUser from "./scenes/team/AddUser";
import EditUser from "./scenes/team/EditUser";
import GanttComponent from "./scenes/gantt";
import Kanban from "./scenes/kanban";
import TestInvoice from "scenes/payment/TestInvoice";
import EarningReports from "scenes/earningreports";
import ProtectedRoute from "./ProtectedRoute";
// import Home from "./scenes/home";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const isAuthenticated = useIsAuthenticated();

  return (

      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {/* Sidebar and Topbar can be conditionally rendered based on `isAuthenticated` */}
            {isAuthenticated() && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {isAuthenticated() && <Topbar setIsSidebar={setIsSidebar} />}
             
            <Routes>
              <Route path="/login" element={<SignIn />} />
              <ProtectedRoute path="/" element={<Dashboard />} roles={['finance']}/>
              <ProtectedRoute path="/chat/" element={<Chat />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/gantt/" element={<GanttComponent />} roles={['manager', 'employee']} />
              <ProtectedRoute path="/invoice/" element={<TestInvoice />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/kanban/" element={<Kanban />} roles={['manager', 'employee']} />
              <ProtectedRoute path="/users" element={<Team />} roles={['admin']} />
              <ProtectedRoute path="/adduser" element={<AddUser />} roles={['admin']} />
              <ProtectedRoute path="/user/:id" element={<EditUser />} roles={['admin']} />
              
              <ProtectedRoute path="/invoices" element={<Invoices />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/form" element={<Form />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/bar" element={<Bar />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/pie" element={<Pie />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/line" element={<Line />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/calendar" element={<Calendar />} roles={['admin', 'manager', 'employee', 'finance']} />
              <ProtectedRoute path="/geography" element={<Geography />} roles={['admin', 'manager', 'employee', 'finance']} />


              <ProtectedRoute path="/customer" element={<Customer />} roles={['finance']} />
              <ProtectedRoute path="/addcustomer" element={<AddCustomer />} roles={['finance']} />
              <ProtectedRoute path="/customer/:id" element={<EditCustomer />} roles={['finance']} />

              <ProtectedRoute path="/contacts" element={<Contacts />} roles={['admin']} />
              <ProtectedRoute path="/addcontact" element={<AddContact />} roles={['admin']} />
              <ProtectedRoute path="/contact/:id" element={<EditContact />} roles={['admin']} />

              <ProtectedRoute path="/payment" element={<Payment />} roles={['finance']} />
              <ProtectedRoute path="/addpayment" element={<AddPayment />} roles={['finance']} />
              <ProtectedRoute path="/payment/:id" element={<EditPayement />} roles={['finance']} />
              <ProtectedRoute path="/earningreports" element={<EarningReports />} roles={['finance']} />

              <ProtectedRoute path="/vendor" element={<Vendor />} roles={['finance']} />
              <ProtectedRoute path="/addvendor" element={<AddVendor />} roles={['finance']} />
              <ProtectedRoute path="/vendor/:id" element={<EditVendor />} roles={['finance']} />

              <ProtectedRoute path="/projects" element={<Project />} roles={['manager']} />
              <ProtectedRoute path="/addproject" element={<AddProject />} roles={['manager']} />
              <ProtectedRoute path="/project/:id" element={<EditProject />} roles={['manager']} />
              <ProtectedRoute path="/form4" element={<Geography />} roles={['admin', 'manager', 'employee', 'finance']} />
              {/* <ProtectedRoute path="/home" element={<Home />} roles={['admin', 'manager', 'employee', 'finance']} /> */}
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
