// src/components/ctrl-freak/NetworkGraph.tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { HUB_POSITIONS_3D, CORRUPTED_HUB, ALL_EDGES, edgeId, HubId } from '../../config/networkHubs';

const HUB_ARRAY = (Object.entries(HUB_POSITIONS_3D) as [string, [number, number, number]][])
  .map(([id, pos]) => ({ id: Number(id) as HubId, pos }));

const SPARK_COUNT = 90;

export function NetworkGraph({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const routes = useCtrlFreakStore((s) => s.network.routes);
  const solved = useCtrlFreakStore((s) => s.network.solved);
  const sparkPositions = useMemo(() => new Float32Array(SPARK_COUNT * 3), []);

  useFrame((state) => {
    if (!visible || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.3; // gentle life, not static

    if (sparksRef.current) {
      const arr = sparksRef.current.geometry.attributes.position.array as Float32Array;
      if (routes.length === 0) {
        arr.fill(9999); // park off-screen when nothing to show
      } else {
        for (let i = 0; i < SPARK_COUNT; i++) {
          const route = routes[i % routes.length];
          const [a, b] = route.split('-').map(Number) as [HubId, HubId];
          const p1 = HUB_POSITIONS_3D[a];
          const p2 = HUB_POSITIONS_3D[b];
          const bad = route.includes(String(CORRUPTED_HUB));
          const speed = solved ? 1.4 : bad ? 0.25 : 0.6;
          const tFlow = (t * speed + i / SPARK_COUNT) % 1;
          const jitter = bad && !solved ? (Math.random() - 0.5) * 0.6 : 0;
          arr[i * 3]     = p1[0] + (p2[0] - p1[0]) * tFlow + jitter;
          arr[i * 3 + 1] = p1[1] + (p2[1] - p1[1]) * tFlow + jitter;
          arr[i * 3 + 2] = p1[2] + (p2[2] - p1[2]) * tFlow + jitter;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {HUB_ARRAY.map(({ id, pos }) => {
        const corrupted = id === CORRUPTED_HUB;
        return (
          <group key={id} position={pos}>
            <mesh>
              <sphereGeometry args={[corrupted ? 1.1 : 0.85, 16, 16]} />
              <meshBasicMaterial color={corrupted ? '#ff3333' : '#ffffff'} transparent opacity={0.9} />
            </mesh>
            <mesh>
              <sphereGeometry args={[corrupted ? 2.2 : 1.6, 16, 16]} />
              <meshBasicMaterial
                color={corrupted ? '#ff3333' : '#3388ff'}
                transparent opacity={0.12} depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}

      {ALL_EDGES.map(([a, b]) => {
        const id = edgeId(a, b);
        const active = routes.includes(id);
        const bad = active && id.includes(String(CORRUPTED_HUB));
        return (
          <Line
            key={id}
            points={[HUB_POSITIONS_3D[a], HUB_POSITIONS_3D[b]]}
            color={solved && active ? '#33ff33' : bad ? '#ff3333' : active ? '#ffffff' : '#333333'}
            lineWidth={active ? 2.5 : 1}
            transparent
            opacity={active ? 0.9 : 0.25}
          />
        );
      })}

      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={SPARK_COUNT} array={sparkPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color={solved ? '#33ff33' : '#ff3333'}
          transparent opacity={0.9} sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}