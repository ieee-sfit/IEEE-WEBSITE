import { create } from 'zustand';

export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | null;

export interface CtrlFreakState {
  anc: {
    phase: number;
    solved: boolean;
  };
  network: {
    frankfurt: number;
    london: number;
    mumbai: number;
    resolution: '1080p' | '4K';
    latency: number;
    solved: boolean;
  };
  vision: {
    pitch: number;
    yaw: number;
    solved: boolean;
  };
  logic: {
    slot1: GateType;
    slot2: GateType;
    solved: boolean;
    slot1Correct: boolean;
    slot2Correct: boolean;
  };
  
  // ANC ACTIONS
  setAncPhase: (val: number) => void;
  checkAncSolved: () => void;
  
  // NETWORK ACTIONS
  setNetworkLoad: (node: 'frankfurt' | 'london' | 'mumbai', value: number) => void;
  setNetworkResolution: (res: '1080p' | '4K') => void;
  checkNetworkSolved: () => void;

  // VISION ACTIONS
  setVisionRotation: (pitch: number, yaw: number) => void;
  checkVisionSolved: () => void;

  // LOGIC ACTIONS
  setLogicSlot: (slot: 1 | 2, gate: GateType) => void;
  checkLogicSolved: () => void;
}

export const useCtrlFreakStore = create<CtrlFreakState>((set) => ({
  anc: {
    phase: 164, // Start unstable
    solved: false
  },
  network: {
    frankfurt: 20,
    london: 30,
    mumbai: 50,
    resolution: '1080p',
    latency: 999,
    solved: false
  },
  vision: {
    pitch: 1.2,
    yaw: -0.8,
    solved: false
  },
  logic: {
    slot1: null,
    slot2: null,
    solved: false,
    slot1Correct: false,
    slot2Correct: false,
  },
  
  // ANC ACTIONS
  setAncPhase: (val) => set((state) => ({
    anc: { ...state.anc, phase: val }
  })),
  checkAncSolved: () => set((state) => ({ 
    anc: { ...state.anc, solved: Math.abs(state.anc.phase - 180) < 5 } 
  })),

  // NETWORK ACTIONS
  setNetworkLoad: (node, value) => set((state) => ({
    network: { ...state.network, [node]: value }
  })),
  setNetworkResolution: (res) => set((state) => ({
    network: { ...state.network, resolution: res }
  })),
  checkNetworkSolved: () => set((state) => {
    const { frankfurt, london, mumbai } = state.network;
    
    // Calculate total load
    const total = frankfurt + london + mumbai;
    
    // Base latency from distance
    let lat = 0;
    
    if (state.network.resolution === '4K') {
      // 4K requires heavy Frankfurt (at least 60) and very little Mumbai
      const frankfurtError = Math.max(0, 60 - frankfurt);
      const mumbaiError = Math.max(0, mumbai - 15);
      lat = 1.0 + (frankfurtError * 0.1) + (mumbaiError * 0.2);
    } else {
      // 1080p requires balance (around 33/33/33)
      const errF = Math.abs(frankfurt - 33);
      const errL = Math.abs(london - 33);
      const errM = Math.abs(mumbai - 34);
      lat = 0.5 + (errF + errL + errM) * 0.05;
    }
    
    // Penalize under-allocation (too little bandwidth allocated overall)
    if (total < 90) lat += (90 - total) * 0.2;
    // Penalize over-allocation (servers crashing)
    if (total > 110) lat += (total - 110) * 0.2;
    
    // Node-specific limits
    if (mumbai > 40) lat += (mumbai - 40) * 0.1; // Mumbai can't handle high load
    if (london > 70) lat += (london - 70) * 0.1; // London maxes out at 70
    
    const latency = Math.round(lat * 10) / 10;
    const solved = latency <= 1.5;
    
    return { network: { ...state.network, latency, solved } };
  }),

  // VISION ACTIONS
  setVisionRotation: (pitch, yaw) => set((state) => ({
    vision: { ...state.vision, pitch, yaw }
  })),
  checkVisionSolved: () => set((state) => {
    const solved = Math.abs(state.vision.pitch) < 0.05 && Math.abs(state.vision.yaw) < 0.05;
    return { vision: { ...state.vision, solved } };
  }),

  // LOGIC ACTIONS
  setLogicSlot: (slot, gate) => set((state) => ({
    logic: { ...state.logic, [`slot${slot}`]: gate }
  })),
  checkLogicSolved: () => set((state) => {
    const { slot1, slot2 } = state.logic;
    
    // Inputs
    let keycard = true;     // 1
    let pressure = false;   // 0
    let manualSwitch = true;// 1
    
    let slot1Correct = false;
    let slot2Correct = false;
    
    // Evaluate Gate 1 (Keycard [Gate1] Pressure)
    let gate1Output = false;
    if (slot1 === 'AND') gate1Output = keycard && pressure;
    else if (slot1 === 'OR') gate1Output = keycard || pressure;
    else if (slot1 === 'XOR') gate1Output = (keycard as boolean) !== (pressure as boolean);
    else if (slot1 === 'NOT') gate1Output = !keycard; // Ignored pressure for NOT
    
    // Evaluate Gate 2 (Gate1 [Gate2] ManualSwitch)
    let finalOutput = false;
    if (slot2 === 'AND') finalOutput = gate1Output && manualSwitch;
    else if (slot2 === 'OR') finalOutput = gate1Output || manualSwitch;
    else if (slot2 === 'XOR') finalOutput = (gate1Output as boolean) !== (manualSwitch as boolean);
    else if (slot2 === 'NOT') finalOutput = !gate1Output;
    
    // It's solved if finalOutput is true AND both slots are filled.
    const solved = finalOutput === true && slot1 !== null && slot2 !== null;
    
    if (solved) {
      slot1Correct = true;
      slot2Correct = true;
    } else {
      // Guide the user towards intermediate 1 output
      slot1Correct = (slot1 !== null && gate1Output === true);
      slot2Correct = false;
    }
    
    return { logic: { ...state.logic, solved, slot1Correct, slot2Correct } };
  })
}));
