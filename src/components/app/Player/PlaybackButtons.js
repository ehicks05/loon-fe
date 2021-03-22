import React from "react";
import {
  useUserStore,
  setSelectedTrackId,
} from "../../../common/UserContextProvider";
import {
  useAppStore,
  getPlaylistById,
} from "../../../common/AppContextProvider";
import { useTimeStore } from "../../../common/TimeContextProvider";

import { useWindowSize } from "react-use";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

const prevButtonStyle = { height: "36px", width: "36px" };
const pauseButtonStyle = { height: "45px", width: "45px" };
const nextButtonStyle = { height: "36px", width: "36px" };

export default function PlaybackButtons() {
  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
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

  function getCurrentPlaylistTrackIds() {
    const currentPlaylist = getPlaylistById(user.userState.selectedPlaylistId);
    if (currentPlaylist)
      return currentPlaylist.playlistTracks.map(
        (playlistTrack) => playlistTrack.track.id
      );
    else return tracks.map((track) => track.id);
  }

  function getNewTrackId(input) {
    const currentPlaylistTrackIds = getCurrentPlaylistTrackIds();
    let newTrackId = -1;
    const shuffle = user.userState.shuffle;
    if (shuffle) {
      let newPlaylistTrackIndex = Math.floor(
        Math.random() * currentPlaylistTrackIds.length
      );
      newTrackId = currentPlaylistTrackIds[newPlaylistTrackIndex];
      console.log("new random trackId: " + newTrackId);
    } else {
      const currentTrackIndex = currentPlaylistTrackIds.indexOf(
        user.userState.selectedTrackId
      );

      let newIndex;
      if (input === "prev") {
        newIndex = currentTrackIndex - 1;
        if (newIndex < 0) {
          newIndex = currentPlaylistTrackIds.length - 1;
        }
      }
      if (input === "next") {
        newIndex = currentTrackIndex + 1;
        if (newIndex >= currentPlaylistTrackIds.length) {
          newIndex = 0;
        }
      }

      newTrackId = currentPlaylistTrackIds[newIndex];
    }

    if (newTrackId === -1) {
      console.error("Unable to select a new track id.");
    }

    return newTrackId;
  }

  const prevButton = (
    <button
      className="button"
      style={prevButtonStyle}
      onClick={() => handleTrackChange("prev")}
    >
      <span className="icon">
        <FaStepBackward />
      </span>
    </button>
  );

  const playButton = (
    <button
      className="button is-medium"
      style={pauseButtonStyle}
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
  );

  const nextButton = (
    <button
      className="button"
      style={nextButtonStyle}
      onClick={() => handleTrackChange("next")}
    >
      <span className="icon">
        <FaStepForward />
      </span>
    </button>
  );

  return (
    <>
      {prevButton}
      {playButton}
      {nextButton}
      {width >= 768 && <span style={{ paddingLeft: "8px" }}> </span>}
    </>
  );
}
