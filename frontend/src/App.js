import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { useIsAuthenticated, useAuthUser } from 'react-auth-kit';
import { Navigate } from "react-router-dom";
import io from "socket.io-client";
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
<<<<<<< HEAD
import Meet from "scenes/meet";
import CreateMeeting from "scenes/meet/src/pages/CreateMeeting";
import Dashboard1 from "scenes/meet/src/pages/Dashboard";
import JoinMeeting from "scenes/meet/src/pages/JoinMeeting";
import Login from "scenes/meet/src/pages/Login";
import Meeting from "scenes/meet/src/pages/Meeting";
import MyMeetings from "scenes/meet/src/pages/MyMeetings";
import OneOnOneMeeting from "scenes/meet/src/pages/OneOnOneMeeting";
import VideoConference from "scenes/meet/src/pages/VideoConference";
=======
import EarningReports from "scenes/earningreports";
import EditProfile from "scenes/global/EditProfile";
>>>>>>> a98793fb4e2a62c5dc9b96e3f55c063145ae9175
// import Home from "./scenes/home";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const getUser = useAuthUser();
  const user = getUser();
  const userRole = user?.user?.role;

<<<<<<< HEAD
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
              <Route path="/meet/*" element={<Meet />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create" element={<CreateMeeting />} />
              <Route path="/create1on1" element={<OneOnOneMeeting />} />
              <Route path="/videoconference" element={<VideoConference />} />
              <Route path="/mymeetings" element={<MyMeetings />} />
              <Route path="/join/:id" element={<JoinMeeting />} />
              <Route path="/meetings" element={<Meeting />} />
              <Route path="/" element={<Dashboard1 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/gantt/" element={<GanttComponent />} />
              <Route path="/invoice/" element={<TestInvoice />} />
              <Route path="/kanban/" element={<Kanban />} />
              <Route path="/signin" element={<SignIn />} />
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
=======
  const isAuthenticated = useIsAuthenticated();
  const socket = useMemo(() => io.connect("http://localhost:5000"), []);
>>>>>>> a98793fb4e2a62c5dc9b96e3f55c063145ae9175


  return (

      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {/* Sidebar and Topbar can be conditionally rendered based on `isAuthenticated` */}
            {isAuthenticated() && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {isAuthenticated() && <Topbar setIsSidebar={setIsSidebar} socket={socket} />}
             
              <Routes>
  <Route path="/login" element={<SignIn />} />
  
  <Route path="/" element={isAuthenticated() && ['finance'].includes(userRole) ? <Dashboard /> : <Navigate to="/login" />} />
  <Route path="/chat/" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Chat socket={socket} /> : <Navigate to="/login" />} />
  <Route path="/updateprofile/" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <EditProfile /> : <Navigate to="/login" />} />
  <Route path="/gantt/" element={isAuthenticated() && ['manager', 'employee'].includes(userRole) ? <GanttComponent /> : <Navigate to="/login" />} />
  <Route path="/invoice/" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <TestInvoice /> : <Navigate to="/login" />} />
  <Route path="/kanban/" element={isAuthenticated() && ['manager', 'employee'].includes(userRole) ? <Kanban /> : <Navigate to="/login" />} />
  <Route path="/users" element={isAuthenticated() && ['admin'].includes(userRole) ? <Team /> : <Navigate to="/login" />} />
  <Route path="/adduser" element={isAuthenticated() && ['admin'].includes(userRole) ? <AddUser /> : <Navigate to="/login" />} />
  <Route path="/user/:id" element={isAuthenticated() && ['admin'].includes(userRole) ? <EditUser /> : <Navigate to="/login" />} />
  <Route path="/invoices" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Invoices /> : <Navigate to="/login" />} />
  <Route path="/form" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Form /> : <Navigate to="/login" />} />
  <Route path="/bar" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Bar /> : <Navigate to="/login" />} />
  <Route path="/pie" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Pie /> : <Navigate to="/login" />} />
  <Route path="/line" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Line /> : <Navigate to="/login" />} />
  <Route path="/calendar" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Calendar /> : <Navigate to="/login" />} />
  <Route path="/geography" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <Geography /> : <Navigate to="/login" />} />
  <Route path="/customer" element={isAuthenticated() && ['finance'].includes(userRole) ? <Customer /> : <Navigate to="/login" />} />
  <Route path="/addcustomer" element={isAuthenticated() && ['finance'].includes(userRole) ? <AddCustomer /> : <Navigate to="/login" />} />
  <Route path="/customer/:id" element={isAuthenticated() && ['finance'].includes(userRole) ? <EditCustomer /> : <Navigate to="/login" />} />
  <Route path="/contacts" element={isAuthenticated() && ['admin'].includes(userRole) ? <Contacts /> : <Navigate to="/login" />} />
  <Route path="/addcontact" element={isAuthenticated() && ['admin'].includes(userRole) ? <AddContact /> : <Navigate to="/login" />} />
  <Route path="/contact/:id" element={isAuthenticated() && ['admin'].includes(userRole) ? <EditContact /> : <Navigate to="/login" />} />
  <Route path="/payment" element={isAuthenticated() && ['finance'].includes(userRole) ? <Payment /> : <Navigate to="/login" />} />
  <Route path="/addpayment" element={isAuthenticated() && ['finance'].includes(userRole) ? <AddPayment /> : <Navigate to="/login" />} />
  <Route path="/payment/:id" element={isAuthenticated() && ['finance'].includes(userRole) ? <EditPayement /> : <Navigate to="/login" />} />
  <Route path="/earningreports" element={isAuthenticated() && ['finance'].includes(userRole) ? <EarningReports /> : <Navigate to="/login" />} />
  <Route path="/vendor" element={isAuthenticated() && ['finance'].includes(userRole) ? <Vendor /> : <Navigate to="/login" />} />
  <Route path="/addvendor" element={isAuthenticated() && ['finance'].includes(userRole) ? <AddVendor /> : <Navigate to="/login" />} />
  <Route path="/vendor/:id" element={isAuthenticated() && ['finance'].includes(userRole) ? <EditVendor /> : <Navigate to="/login" />} />
  <Route path="/projects" element={isAuthenticated() && ['manager'].includes(userRole) ? <Project /> : <Navigate to="/login" />} />
  <Route path="/addproject" element={isAuthenticated() && ['manager'].includes(userRole) ? <AddProject /> : <Navigate to="/login" />} />
  <Route path="/project/:id" element={isAuthenticated() && ['manager'].includes(userRole) ? <EditProject /> : <Navigate to="/login" />} />
  <Route path="/invoice" element={isAuthenticated() && ['admin', 'manager', 'employee', 'finance'].includes(userRole) ? <TestInvoice /> : <Navigate to="/login" />} />
</Routes>

          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
