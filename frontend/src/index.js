import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider authStorageType={'cookie'} 
  authStorageName={'_auth_t'}
  authTimeStorageName={'_auth_time'}
  stateStorageName={'_auth_state'}
  cookieDomain={window.location.hostname}
  cookieSecure={false}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
);
