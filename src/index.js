import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppContextProvider } from "./common/AppContextProvider";
import "index.css";
import "bulma-prefers-dark.css";

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById("root")
);
