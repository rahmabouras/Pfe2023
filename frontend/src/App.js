import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
// import Home from "./scenes/home";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/gantt/" element={<GanttComponent />} />
              <Route path="/invoice/" element={<TestInvoice />} />
              <Route path="/kanban/" element={<Kanban />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/users" element={<Team />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/user/:id" element={<EditUser />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/addcustomer" element={<AddCustomer />} />
              <Route path="/customer/:id" element={<EditCustomer />} />

              <Route path="/addcontact" element={<AddContact />} />
              <Route path="/contact/:id" element={<EditContact />} />

              <Route path="/payment" element={<Payment />} />
              <Route path="/addpayment" element={<AddPayment />} />
              <Route path="/payment/:id" element={<EditPayement />} />

              <Route path="/earningreports" element={<EarningReports />} />

              <Route path="/vendor" element={<Vendor />} />
              <Route path="/addvendor" element={<AddVendor />} />
              <Route path="/vendor/:id" element={<EditVendor />} />

              <Route path="/projects" element={<Project />} />
              <Route path="/addproject" element={<AddProject />} />
              <Route path="/project/:id" element={<EditProject />} />
              <Route path="/form4" element={<Geography />} />
              {/* <Route path="/home" element={<Home />} /> */}
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
