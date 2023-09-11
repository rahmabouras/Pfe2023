
import React from "react";
import App from "./src/App";
import { Provider } from "react-redux";
import { store } from "./src/app/store";

const Meet = () => {
  return (
    <Provider store={store}>
    <App />
</Provider>
  )
}

export default Meet