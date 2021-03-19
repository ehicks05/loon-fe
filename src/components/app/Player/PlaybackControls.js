import React from "react";
import { FaVolumeUp, FaVolumeOff, FaRandom } from "react-icons/fa";
import {
  useUserStore,
  setShuffle,
  setMuted,
} from "../../../common/UserContextProvider";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import TrackProgressBar from "./TrackProgressBar";
import TrackDescription from "./TrackDescription";
import PlaybackButtons from "./PlaybackButtons";
import VolumeSlider from "./VolumeSlider";

const levelRightStyle = { marginTop: "4px", marginRight: "8px" };
const levelRightStyleMobile = { marginTop: "4px", marginRight: "0" };
const myLevel1Style = {
  zIndex: "5",
  position: "static",
  padding: "8px",
  paddingBottom: "0",
};
const myLevel2Style = {
  zIndex: "5",
  position: "static",
  padding: "8px",
  paddingTop: "0",
};

export default function PlaybackControls(props) {
  const isWidthOver768 = useMediaQuery("(min-width: 768px)");

  const playbackButtons = (
    <PlaybackButtons
      playerState={props.playerState}
      onPlayerStateChange={props.onPlayerStateChange}
    />
  );

  const levelLeft = (
    <div className="level-left">
      {isWidthOver768 && playbackButtons}
      <TrackDescription />
    </div>
  );

  const levelRight = (
    <div
      className="level-right"
      style={isWidthOver768 ? levelRightStyle : levelRightStyleMobile}
    >
      <div className="level-item">
        {!isWidthOver768 && playbackButtons}
        <ShuffleButton />
        <MuteButton />
        <VolumeSlider />
      </div>
    </div>
  );

  return (
    <>
      <div className="section myLevel" style={myLevel1Style}>
        <nav className="level">
          <TrackProgressBar onProgressChange={props.onProgressChange} />
        </nav>
      </div>

      <div className="section myLevel" style={myLevel2Style}>
        <nav className="level">
          {levelLeft}
          {levelRight}
        </nav>
      </div>
    </>
  );
}

const shuffleButtonStyle = { marginLeft: "1.5em" };

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
      style={shuffleButtonStyle}
      onClick={handleShuffleChange}
    >
      <span className="icon">
        <FaRandom />
      </span>
    </button>
  );
}

const muteButtonStyle = { margin: "0 .75em 0 .5em" };

function MuteButton() {
  const user = useUserStore((state) => state.user);
  function handleMuteChange() {
    setMuted(!user.userState.muted);
  }

  return (
    <button
      className="button is-small"
      style={muteButtonStyle}
      onClick={handleMuteChange}
    >
      <span className="icon">
        {user.userState.muted ? <FaVolumeOff fixedWidth /> : <FaVolumeUp />}
      </span>
    </button>
  );
}
