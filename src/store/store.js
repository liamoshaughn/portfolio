import { create } from 'zustand';

const useAnimationStore = create((set) => ({
  stage: 0,
  loadingProgress: 0,
  moving: false,
  restState: 0,
  disableCamera: false,

  increment: () => set((state) => ({ stage: state.stage + 1 })),
  setStage: (number) => set(() => ({stage: number})),
  setLoadingProgress: (progress) => set(() => ({ loadingProgress: progress })),
  setMoving: (bool) => set(() => ({ moving: bool })),
  setRest: () => set((state) => ({ restState: state.restState + 1 })),
  setDisableCamera: (bool) => set(() => ({ disableCamera: bool })),
}));

const useUtilityStore = create((set) => ({
  aspectRatio : window.innerWidth / window.innerHeight,
  setAspectRatio: (ratio) => set(() => ({ aspectRatio: ratio })),
}))

export {useUtilityStore, useAnimationStore };
