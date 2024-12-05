import { create } from 'zustand';

const useAnimationStore = create((set) => ({
  stage: 0,
  loadingProgress: 0,
  moving: false,
  restState: 0,

  increment: () => set((state) => ({ stage: state.stage + 1 })),
  setLoadingProgress: (progress) => set(() => ({ loadingProgress: progress })),
  setMoving: (bool) => set(() => ({ moving: bool })),
  setRest: () => set((state) => ({ restState: state.restState + 1 })),
}));

const useUtilityStore = create((set) => ({
  aspectRatio : window.innerWidth / window.innerHeight,
  setAspectRatio: (ratio) => set(() => ({ aspectRatio: ratio })),
}))

export {useUtilityStore, useAnimationStore };
