// src/config/networkHubs.ts

export type HubId = 0 | 1 | 2 | 3 | 4;

export const HUB_LABELS: Record<HubId, string> = {
  0: 'SRC', 1: 'DST', 2: 'RLY-1', 3: 'RLY-2', 4: 'RLY-3',
};

export const CORRUPTED_HUB: HubId = 3;

// Mirrors the 2D panel's diamond: SRC left, DST right, RLY-1 above,
// RLY-2 (corrupted) center-front, RLY-3 below.
export const HUB_POSITIONS_3D: Record<HubId, [number, number, number]> = {
  0: [-14, 0, 0],
  1: [14, 0, 0],
  2: [0, 9, -3],
  3: [0, 0, 4],
  4: [0, -9, -3],
};

export const ALL_EDGES: [HubId, HubId][] = [
  [0, 2], [2, 1],
  [0, 3], [3, 1],
  [0, 4], [4, 1],
];

export function edgeId(a: HubId, b: HubId) {
  return [a, b].sort().join('-');
}