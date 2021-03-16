import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserContextProvider } from "./common/UserContextProvider";
import { AppContextProvider } from "./common/AppContextProvider";
import { VolumeContextProvider } from "./common/VolumeContextProvider";
import { TimeContextProvider } from "./common/TimeContextProvider";

ReactDOM.render(
  <UserContextProvider>
    <AppContextProvider>
      <VolumeContextProvider>
        <TimeContextProvider>
          <App />
        </TimeContextProvider>
      </VolumeContextProvider>
    </AppContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);
