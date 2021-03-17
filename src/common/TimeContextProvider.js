import create from "zustand";

const useTimeStore = create((set) => ({
  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

  duration: 0,
  setDuration: (duration) => set({ duration }),
}));

export { useTimeStore };
