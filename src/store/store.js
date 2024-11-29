import { create } from 'zustand';

const useAnimationStore = create((set) => ({
  // Initial state
  stage: 0,
  loadingProgress: 0,
  // Actions
  increment: () => set((state) => ({ stage: state.stage + 1 })),
  setLoadingProgress: (progress) => set(() => ({ loadingProgress: progress })),
}));

const useUtilityStore = create((set) => ({
  internetSpeed: 1000,
  setInternetSpeed: (speed) => set(() => ({ internetSpeed: speed })),
  estimatedLoadTime: 1000,
  setLoadTime: (speed) => set(() => ({ estimatedLoadTime: speed })),
}))

export {useUtilityStore, useAnimationStore };
