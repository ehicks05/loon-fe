import React from "react";
import { setSelectedTrackId } from "../../../common/UserContextProvider";
import { useTimeStore } from "../../../common/TimeContextProvider";

import { useWindowSize } from "react-use";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { getNewTrackId } from "./utils";

export default function PlaybackButtons() {
  const playerState = useTimeStore((state) => state.playerState);
  const setPlayerState = useTimeStore((state) => state.setPlayerState);
  const { width } = useWindowSize();

  function handlePlayerStateChange(newState) {
    setPlayerState(newState);
  }

  function handleTrackChange(direction) {
    const newTrackId = getNewTrackId(direction);
    setSelectedTrackId(newTrackId);
  }

  return (
    <>
      <button
        className="button"
        style={{ height: "36px", width: "36px" }}
        onClick={() => handleTrackChange("prev")}
      >
        <span className="icon">
          <FaStepBackward />
        </span>
      </button>
      <button
        className="button is-medium"
        style={{ height: "45px", width: "45px" }}
        onClick={() =>
          handlePlayerStateChange(
            playerState === "playing" ? "paused" : "playing"
          )
        }
      >
        <span className="icon">
          {playerState === "playing" ? <FaPause /> : <FaPlay />}
        </span>
      </button>
      <button
        className="button"
        style={{ height: "36px", width: "36px" }}
        onClick={() => handleTrackChange("next")}
      >
        <span className="icon">
          <FaStepForward />
        </span>
      </button>
      {width >= 768 && <span style={{ paddingLeft: "8px" }}> </span>}
    </>
  );
}
