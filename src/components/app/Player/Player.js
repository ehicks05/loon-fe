import { useEffect, useRef } from "react";
import {
  useUserStore,
  setSelectedTrackId,
} from "../../../common/UserContextProvider";
import { useAppStore } from "../../../common/AppContextProvider";
import {
  scaleVolume,
  getMaxSafeGain,
  scrollIntoView,
} from "../../../common/PlayerUtil";
import { useTimeStore } from "../../../common/TimeContextProvider";
import { getNewTrackId } from "./utils";
import renderSpectrumFrame from "./spectrum";

const Player = () => {
  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const {
    setElapsedTime,
    setDuration,
    playerState,
    setPlayerState,
    forcedElapsedTime,
  } = useTimeStore((state) => ({
    setElapsedTime: state.setElapsedTime,
    setDuration: state.setDuration,
    playerState: state.playerState,
    setPlayerState: state.setPlayerState,
    forcedElapsedTime: state.forcedElapsedTime,
  }));
  const volume = user.userState.volume;

  let audio = useRef({});
  let audioCtx = useRef({});
  let trackGainNode = useRef({});
  let gainNode = useRef({});
  let band1 = useRef({});
  let band2 = useRef({});
  let band3 = useRef({});
  let band4 = useRef({});
  let analyser = useRef({});
  let audioBufferSourceNode = useRef({});

  useEffect(() => {
    handlePlayerStateChange(playerState);
  }, [playerState]);

  useEffect(() => {
    if (audio) audio.current.currentTime = forcedElapsedTime;
  }, [forcedElapsedTime]);

  useEffect(() => {
    const userState = user.userState;

    function initAudio() {
      let audio = new Audio();
      audio.controls = false;
      audio.autoplay = false;
      audio.onended = function () {
        handleTrackChange("next");
      };
      audio.ondurationchange = function () {
        setDuration(audio.duration);
      };
      audio.onerror = function () {
        console.log(audio.error);
      };
      document.body.appendChild(audio);
      return audio;
    }
    audio.current = initAudio();

    audioCtx.current = new window.AudioContext();
    trackGainNode.current = audioCtx.current.createGain();
    gainNode.current = audioCtx.current.createGain();
    band1.current = audioCtx.current.createBiquadFilter();
    band2.current = audioCtx.current.createBiquadFilter();
    band3.current = audioCtx.current.createBiquadFilter();
    band4.current = audioCtx.current.createBiquadFilter();
    analyser.current = audioCtx.current.createAnalyser();

    gainNode.current.gain.value = scaleVolume(volume);
    gainNode.current.connect(trackGainNode.current);

    band1.current.type = "lowshelf";
    band1.current.frequency.value = userState.eq1Frequency;
    band1.current.gain.value = userState.eq1Gain;
    band2.current.type = "peaking";
    band2.current.frequency.value = userState.eq2Frequency;
    band2.current.gain.value = userState.eq2Gain;
    band3.current.type = "peaking";
    band3.current.frequency.value = userState.eq3Frequency;
    band3.current.gain.value = userState.eq3Gain;
    band4.current.type = "highshelf";
    band4.current.frequency.value = userState.eq4Frequency;
    band4.current.gain.value = userState.eq4Gain;

    analyser.current.fftSize = 4096;

    trackGainNode.current.connect(band1.current);
    band1.current.connect(band2.current);
    band2.current.connect(band3.current);
    band3.current.connect(band4.current);
    band4.current.connect(analyser.current);

    analyser.current.connect(audioCtx.current.destination);

    audioBufferSourceNode.current = audioCtx.current.createMediaElementSource(
      audio.current
    );
    audioBufferSourceNode.current.connect(gainNode.current);

    scrollIntoView(userState.selectedTrackId);

    function step() {
      if (audio) setElapsedTime(audio.current.currentTime);
    }
    setInterval(step, 500);

    renderSpectrumFrame(audioCtx, analyser, playerState);

    function initKeyboardShortcuts() {
      document.body.addEventListener("keyup", function (e) {
        if (e.target.tagName === "INPUT") return;

        if (e.key === " ")
          handlePlayerStateChange(
            playerState === "playing" ? "paused" : "playing"
          );
        if (e.key === "ArrowRight") handleTrackChange("next");
        if (e.key === "ArrowLeft") handleTrackChange("prev");
      });
    }
    initKeyboardShortcuts();
  }, []);

  const renders = useRef(0);

  useEffect(() => {
    if (renders.current === 0) {
      renders.current = renders.current + 1;
      return;
    }

    handlePlayerStateChange(null, user.userState.selectedTrackId);
  }, [user.userState.selectedTrackId]);
  useEffect(() => {
    if (gainNode.current) gainNode.current.gain.value = scaleVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!audio.current) return;

    const userState = user.userState;
    audio.current.muted = userState.muted;
    band1.current.frequency.value = userState.eq1Frequency;
    band1.current.gain.value = userState.eq1Gain;
    band2.current.frequency.value = userState.eq2Frequency;
    band2.current.gain.value = userState.eq2Gain;
    band3.current.frequency.value = userState.eq3Frequency;
    band3.current.gain.value = userState.eq3Gain;
    band4.current.frequency.value = userState.eq4Frequency;
    band4.current.gain.value = userState.eq4Gain;
  }, [user]);

  function handleTrackChange(direction) {
    const newTrackId = getNewTrackId(direction);
    setSelectedTrackId(newTrackId);
  }

  function handlePlayerStateChange(newPlayerState, newTrackId) {
    console.log(`handlePlayerStateChange(${newPlayerState}, ${newTrackId})`);

    if (newPlayerState === "paused") audioCtx.current.suspend();
    if (newPlayerState === "playing" || !newPlayerState) {
      // resume
      if (
        !newTrackId &&
        audio.current.currentSrc &&
        audioCtx.current.state === "suspended"
      ) {
        audio.current.play();
        audioCtx.current.resume();
        setPlayerState(newPlayerState);

        return;
      }

      // resume if suspended because of Autoplay Policy
      if (
        newPlayerState === "playing" &&
        audioCtx.current.state === "suspended"
      )
        audioCtx.current.resume();

      setElapsedTime(0);

      if (!newTrackId) newTrackId = user.userState.selectedTrackId;

      let track = tracks.find((track) => track.id === newTrackId);
      if (!track) {
        console.log("no track found...");
        handleTrackChange("next");
        return;
      }
      if (track.missingFile) {
        console.log("attempted to play a track with missing file...");
        handleTrackChange("next");
        return;
      }

      if (audio.current && audioCtx.current.state === "running") {
        if (audio.current.src === "/media?id=" + track.id) {
          // we need to pause
          audioCtx.current.suspend();
          setPlayerState("paused"); // do this since we're exiting early
          return;
        }
      }

      if (audio.current) {
        audio.current.volume = 0;
        audio.current.src = "/media?id=" + track.id;
      }
      if (trackGainNode.current)
        trackGainNode.current.gain.value = getMaxSafeGain(
          track.trackGainLinear,
          track.trackPeak
        );

      const playPromise = audio.current ? audio.current.play() : null;
      if (playPromise !== null) {
        playPromise
          .then(() => {
            audio.current.volume = 1;

            // This triggers when we hit 'next track' button while playback is paused.
            // The player will go to start playing the new track and immediately pause.
            if (
              !newPlayerState &&
              (playerState === "paused" || playerState === "stopped")
            ) {
              audioCtx.current.suspend();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }

      scrollIntoView(track.id);
    }

    if (newPlayerState) setPlayerState(newPlayerState);
  }

  return null;
};

export default Player;
