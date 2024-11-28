import { create } from 'zustand';

const useAnimationStore = create((set) => ({
  // Initial state
  stage: 0,

  // Actions
  increment: () => set((state) => ({ stage: state.stage + 1 })),
}));

export {useAnimationStore};
