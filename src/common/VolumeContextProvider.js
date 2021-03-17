import create from "zustand";

const useVolumeStore = create((set) => ({
  volume: -30,
  setVolume: (volume) => set({ volume }),

  duration: 0,
  setDuration: (duration) => set({ duration }),
}));

export { useVolumeStore };
