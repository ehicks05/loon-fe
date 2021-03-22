import create from "zustand";

const useTimeStore = create((set) => ({
  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

  duration: 0,
  setDuration: (duration) => set({ duration }),

  playerState: "stopped",
  setPlayerState: (playerState) => set({ playerState }),

  forcedElapsedTime: 0,
  setForcedElapsedTime: (forcedElapsedTime) => set({ forcedElapsedTime }),
}));

export { useTimeStore };
