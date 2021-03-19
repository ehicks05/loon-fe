import React, { useEffect, useState } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import "bulma/css/bulma.min.css";

import Header from "./Header";
import MyHelmet from "./MyHelmet";
import Player from "./components/app/Player/Player";
import Routes from "./Routes";
import { useUserStore, fetchUser } from "./common/UserContextProvider";
import {
  useAppStore,
  getTrackById,
  fetchTracks,
  fetchPlaylists,
} from "./common/AppContextProvider";
import { useWindowSize } from "react-use";
import LoginForm from "./LoginForm";

import SidePanel from "./SidePanel";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function App() {
  const [history] = useState(createBrowserHistory({ basename: "/" }));
  const [columnHeight, setColumnHeight] = useState("");

  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const playlists = useAppStore((state) => state.playlists);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.err) await fetchUser();
      if (user && !user.err) {
        await fetchTracks();
        await fetchPlaylists();
      }
    };
    fetchData();

    const pollIntervalId = setInterval(function () {
      fetch("/api/poll", { method: "GET" })
        .then((response) => response.text())
        .then((text) => console.log("poll result: " + text));
    }, 60 * 60 * 1000); // once an hour

    return function cleanup() {
      clearInterval(pollIntervalId);
    };
  }, [user]);

  useEffect(() => {
    const headerHeight = 52;
    const progressBarHeight = 23;
    const footerHeight = progressBarHeight + (width <= 768 ? 111 : 62);
    const columnHeight = "" + (height - (headerHeight + footerHeight)) + "px";
    setColumnHeight(columnHeight);
    console.log(columnHeight);
  }, [width, height]);

  useEffect(() => {
    function getSelectedTrack() {
      const ready = user?.userState?.selectedTrackId && tracks;
      return ready ? getTrackById(user.userState.selectedTrackId) : null;
    }

    const selectedTrack = getSelectedTrack();
    const title = selectedTrack
      ? selectedTrack.title + " by " + selectedTrack.artist
      : "Loon";
    window.document.title = title;
  }, [tracks, user?.userState?.selectedTrackId]);

  console.dir(user);
  if (user?.err) return <LoginForm />;

  console.dir(user);
  console.dir(tracks);
  console.dir(playlists);

  const loaded = user && tracks && playlists;
  if (!loaded) {
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
