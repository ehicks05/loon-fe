import React, { useContext, useEffect, useState } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import "bulma/css/bulma.min.css";

import Header from "./Header";
import MyHelmet from "./MyHelmet";
import Player from "./components/player/Player";
import Routes from "./Routes";
import { UserContext } from "./common/UserContextProvider";
import { AppContext } from "./common/AppContextProvider";
import { useWindowSize } from "react-use";
import LoginForm from "./LoginForm";

import SidePanel from "./SidePanel";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function App() {
  const [history] = useState(createBrowserHistory({ basename: "/" }));
  const [columnHeight, setColumnHeight] = useState("");

  const userContext = useContext(UserContext);
  const appContext = useContext(AppContext);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const pollIntervalId = setInterval(function () {
      fetch("/api/poll", { method: "GET" })
        .then((response) => response.text())
        .then((text) => console.log("poll result: " + text));
    }, 60 * 60 * 1000); // once an hour

    return function cleanup() {
      clearInterval(pollIntervalId);
    };
  }, []);

  useEffect(() => {
    const headerHeight = 52;
    const progressBarHeight = 23;
    const footerHeight = progressBarHeight + (width <= 768 ? 111 : 62);
    const columnHeight = "" + (height - (headerHeight + footerHeight)) + "px";
    setColumnHeight(columnHeight);
    console.log(columnHeight);
  }, [width, height]);

  if (!userContext.user) return <LoginForm />;

  console.log(userContext.user);

  const dataLoaded =
    userContext?.user && appContext?.tracks && appContext?.playlists;
  if (!dataLoaded) {
    const style = {
      width: "100vw",
      height: "100vh",
      display: "flex",
    };

    return (
      <>
        <MyHelmet />
        <div style={style}>
          <div style={{ margin: "auto" }}>
            <Loader
              type="RevolvingDot"
              color="#44CC44"
              height={150}
              width={150}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <Router history={history}>
      <MyHelmet />
      <Header />
      <div className={"columns is-gapless"}>
        <div
          id="left-column"
          style={{ height: columnHeight, overflow: "hidden auto" }}
          className={"column is-narrow is-hidden-touch"}
        >
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ overflowY: "auto" }}>
              <SidePanel />
            </div>
            <div style={{ flex: "1 1 auto" }}> </div>
            <div style={{ height: "100px" }}>
              <canvas id="spectrumCanvas" height={100} width={150} />
            </div>
          </div>
        </div>
        <div
          className="column"
          style={{ height: columnHeight, overflow: "hidden auto" }}
        >
          <Routes />
        </div>
      </div>
      <Player />
    </Router>
  );
}
