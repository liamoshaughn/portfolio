import { create } from 'zustand';

const useAnimationStore = create((set) => ({
  // Initial state
  stage: 0,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export {useAnimationStore};
