import React from "react";
import { FaVolumeUp, FaVolumeOff, FaRandom } from "react-icons/fa";
import {
  useUserStore,
  setShuffle,
  setMuted,
} from "../../../common/UserContextProvider";
import { useWindowSize } from "react-use";
import TrackProgressBar from "./TrackProgressBar";
import TrackDescription from "./TrackDescription";
import PlaybackButtons from "./PlaybackButtons";
import VolumeSlider from "./VolumeSlider";

export default function PlaybackControls() {
  const isWidthOver768 = useWindowSize().width >= 768;

  return (
    <>
      <div
        className="section myLevel"
        style={{
          zIndex: "5",
          position: "static",
          padding: "8px",
          paddingBottom: "0",
        }}
      >
        <nav className="level">
          <TrackProgressBar />
        </nav>
      </div>

      <div
        className="section myLevel"
        style={{
          zIndex: "5",
          position: "static",
          padding: "8px",
          paddingTop: "0",
        }}
      >
        <nav className="level">
          <div className="level-left">
            {isWidthOver768 && <PlaybackButtons />}
            <TrackDescription />
          </div>
          <div
            className="level-right"
            style={
              isWidthOver768
                ? { marginTop: "4px", marginRight: "8px" }
                : { marginTop: "4px", marginRight: "0" }
            }
          >
            <div className="level-item">
              {!isWidthOver768 && <PlaybackButtons />}
              <ShuffleButton />
              <MuteButton />
              <VolumeSlider />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

function ShuffleButton() {
  const user = useUserStore((state) => state.user);
  function handleShuffleChange() {
    setShuffle(!user.userState.shuffle);
  }

  return (
    <button
      className={
        "button is-small" + (user.userState.shuffle ? " is-success" : "")
      }
      style={{ marginLeft: "1.5em" }}
      onClick={handleShuffleChange}
    >
      <span className="icon">
        <FaRandom />
      </span>
    </button>
  );
}

function MuteButton() {
  const user = useUserStore((state) => state.user);
  function handleMuteChange() {
    setMuted(!user.userState.muted);
  }

  return (
    <button
      className="button is-small"
      style={{ margin: "0 .75em 0 .5em" }}
      onClick={handleMuteChange}
    >
      <span className="icon">
        {user.userState.muted ? <FaVolumeOff fixedWidth /> : <FaVolumeUp />}
      </span>
    </button>
  );
}
