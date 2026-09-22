import { create } from 'zustand';

export interface CtrlFreakState {
  anc: {
    phase: number;
    solved: boolean;
  };
  network: {
    routes: string[];
    solved: boolean;
  };
  setAncPhase: (val: number) => void;
  checkAncSolved: () => void;
  addNetworkRoute: (fromId: number, toId: number) => void;
  removeNetworkRoute: (fromId: number, toId: number) => void;
  clearNetworkRoutes: () => void;
  checkNetworkSolved: () => void;
}

export const useCtrlFreakStore = create<CtrlFreakState>((set) => ({
  anc: {
    phase: 164, // Start unstable
    solved: false
  },
  network: {
    routes: [], // Array of string pairs e.g. "A-B"
    solved: false
  },
  
  // ANC ACTIONS
  setAncPhase: (val) => set((state) => ({
    anc: { ...state.anc, phase: val }
  })),
  checkAncSolved: () => set((state) => {
    // Solved if within 2 degrees of 180
    const error = Math.abs(state.anc.phase - 180);
    const solved = error <= 2;
    return { anc: { ...state.anc, solved } };
  }),

  // NETWORK ACTIONS
  addNetworkRoute: (fromId, toId) => set((state) => {
    const routeId = [fromId, toId].sort().join('-');
    if (state.network.routes.includes(routeId)) return state; // Prevent duplicates
    return { network: { ...state.network, routes: [...state.network.routes, routeId] } };
  }),
  removeNetworkRoute: (fromId, toId) => set((state) => {
    const routeId = [fromId, toId].sort().join('-');
    return { network: { ...state.network, routes: state.network.routes.filter(r => r !== routeId) } };
  }),
  clearNetworkRoutes: () => set((state) => ({
    network: { ...state.network, routes: [] }
  })),
  checkNetworkSolved: () => set((state) => {
    // The target path is 0 -> 2 -> 4 -> 1 (bypassing node 3 which is "corrupted")
    // Valid edges required: '0-2', '2-4', '1-4'
    const requiredEdges = ['0-2', '2-4', '1-4'];
    const hasRequired = requiredEdges.every(edge => state.network.routes.includes(edge));
    // And NO other edges allowed for a perfect solve
    const hasExtras = state.network.routes.length > 3;
    const hasCorrupted = state.network.routes.some(edge => edge.includes('3'));
    
    const solved = hasRequired && !hasExtras && !hasCorrupted;
    return { network: { ...state.network, solved } };
  })
}));
