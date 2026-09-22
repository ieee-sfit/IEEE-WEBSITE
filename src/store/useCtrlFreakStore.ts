import { create } from 'zustand';

export interface CtrlFreakState {
  anc: {
    phase: number;
    solved: boolean;
  };
  setAncPhase: (val: number) => void;
  checkAncSolved: () => void;
}

export const useCtrlFreakStore = create<CtrlFreakState>((set) => ({
  anc: {
    phase: 164, // Start unstable
    solved: false
  },
  setAncPhase: (val) => set((state) => ({
    anc: { ...state.anc, phase: val }
  })),
  checkAncSolved: () => set((state) => {
    // Solved if within 2 degrees of 180
    const error = Math.abs(state.anc.phase - 180);
    const solved = error <= 2;
    return { anc: { ...state.anc, solved } };
  })
}));
