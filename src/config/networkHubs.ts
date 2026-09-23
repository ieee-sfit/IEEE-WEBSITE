// src/config/networkHubs.ts

export type HubId = 0 | 1 | 2 | 3 | 4;

export const HUB_LABELS: Record<HubId, string> = {
  0: 'SRC [LOCAL]', 
  1: 'DST [STREAM]', 
  2: 'FRANKFURT', 
  3: 'MUMBAI', 
  4: 'LONDON',
};

export const CORRUPTED_HUB: HubId = 3;

// Clean pentagon-like layout
export const HUB_POSITIONS_3D: Record<HubId, [number, number, number]> = {
  0: [-12, 0, 0],   // Left (SRC)
  1: [12, 0, 0],    // Right (DST)
  2: [-4, 8, -4],   // Top (Frankfurt)
  3: [0, -2, 6],    // Front-Center (Mumbai - Corrupted)
  4: [4, -8, -4],   // Bottom (London)
};

export const ALL_EDGES: [HubId, HubId][] = [
  // SRC to Relays
  [0, 2], [0, 3], [0, 4],
  // Relays to each other
  [2, 3], [3, 4], [2, 4],
  // Relays to DST
  [2, 1], [3, 1], [4, 1],
];

export function edgeId(a: HubId, b: HubId) {
  return [a, b].sort().join('-');
}