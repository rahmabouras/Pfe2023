import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./scenes/meet/src/app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<<<<<<< HEAD
  <Provider store={store}>
=======
  <AuthProvider authStorageType={'cookie'} 
  authStorageName={'_auth_t'}
  authTimeStorageName={'_auth_time'}
  stateStorageName={'_auth_state'}
  cookieDomain={window.location.hostname}
  cookieSecure={false}>
>>>>>>> a98793fb4e2a62c5dc9b96e3f55c063145ae9175
    <BrowserRouter>
      <App />
     
    </BrowserRouter>
<<<<<<< HEAD
    </Provider>
=======
    </AuthProvider>
>>>>>>> a98793fb4e2a62c5dc9b96e3f55c063145ae9175
);
