import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserContextProvider } from "./common/UserContextProvider";
import { AppContextProvider } from "./common/AppContextProvider";
import "index.css";
import "bulma-prefers-dark.css";

ReactDOM.render(
  <UserContextProvider>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);
