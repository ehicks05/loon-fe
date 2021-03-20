import React, { useEffect, useState } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import "bulma/css/bulma.min.css";

import Header from "./Header";
import Player from "./components/app/Player/Player";
import Routes from "./Routes";
import { useUserStore, fetchUser } from "./common/UserContextProvider";
import {
  useAppStore,
  fetchTracks,
  fetchPlaylists,
} from "./common/AppContextProvider";
import { useWindowSize } from "react-use";
import LoginForm from "./LoginForm";

import SidePanel from "./SidePanel";
import Title from "./Title";
import PageLoader from "PageLoader";

export default function App() {
  const [history] = useState(createBrowserHistory({ basename: "/" }));
  const [columnHeight, setColumnHeight] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const playlists = useAppStore((state) => state.playlists);
  const { width, height } = useWindowSize();

  // load user
  useEffect(() => {
    const fetch = async () => {
      await fetchUser();
      setUserLoading(false);
    };
    fetch();
  }, []);

  // load library
  useEffect(() => {
    const fetchLibrary = async () => {
      await fetchTracks();
      await fetchPlaylists();
      setLibraryLoading(false);
    };
    if (user && !userLoading) fetchLibrary();
  }, [userLoading]);

  // polling
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

  if (!user && !userLoading) return <LoginForm />;

  if (!(user && tracks && playlists)) return <PageLoader />;

  return (
    <Router history={history}>
      <Title />
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
