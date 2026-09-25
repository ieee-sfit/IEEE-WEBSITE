import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';

// Procedural Vocabulary Geometry Sizes
const PILLAR_SIZE: [number, number, number] = [3, 80, 3];
const BEAM_SIZE: [number, number, number] = [40, 2, 2];
const PLATFORM_SIZE: [number, number, number] = [12, 1, 12];
const STAIR_SIZE: [number, number, number] = [4, 0.5, 15]; // Represented as a slanted box for silhouette

// The single, flat, dark concrete material
const brutalistMaterial = new THREE.MeshStandardMaterial({
  color: '#1a1a1a',
  roughness: 0.9,
  metalness: 0.1,
});

// Thin emissive tube/line meshes tracing a right-angle path up a pillar face
function CircuitTrace({ color, pathPoints }: { color: string, pathPoints: [number, number, number][] }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(
    pathPoints.map(p => new THREE.Vector3(...p))
  ), [pathPoints]);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
      <meshStandardMaterial 
        color="#111111" 
        emissive={color} 
        emissiveIntensity={2.5} 
      />
    </mesh>
  );
}

export function ControlChamber({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pillarRef = useRef<THREE.InstancedMesh>(null);
  const beamRef = useRef<THREE.InstancedMesh>(null);
  const platformRef = useRef<THREE.InstancedMesh>(null);
  const stairRef = useRef<THREE.InstancedMesh>(null);

  // Vocabulary limits
  const pillarCount = 24;
  const beamCount = 36;
  const platformCount = 8;
  const stairCount = 12;

  // React to solved states for lighting changes
  const ancSolved = useCtrlFreakStore(s => s.anc.solved);
  const networkSolved = useCtrlFreakStore(s => s.network.solved);
  const logicSolved = useCtrlFreakStore(s => s.logic.solved);

  const hemiRef = useRef<THREE.HemisphereLight>(null);

  // Color-script the whole environment to the narrative
  const stationColors = useMemo(() => [
    new THREE.Color('#ffffff'), // 0: Start/ANC
    new THREE.Color('#3388ff'), // 1: Network
    new THREE.Color('#ffaa00'), // 2: Vision
    new THREE.Color('#ff3333'), // 3: Logic
  ], []);

  useFrame(() => {
    if (!hemiRef.current) return;
    const p = scrollProgress.get();
    
    // Determine target color based on scroll segments
    let targetColor = stationColors[0];
    if (p > 0.7) targetColor = stationColors[3];
    else if (p > 0.45) targetColor = stationColors[2];
    else if (p > 0.25) targetColor = stationColors[1];
    
    // Smoothly lerp the hemisphere light color
    hemiRef.current.color.lerp(targetColor, 0.05);
  });

  useEffect(() => {
    if (!pillarRef.current || !beamRef.current || !platformRef.current || !stairRef.current) return;

    const dummy = new THREE.Object3D();

    // 1. PILLARS (The Octagonal/Circular Shell) - Much wider now
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const radius = 70 + Math.random() * 20; // Expanded perimeter
      
      let px = Math.cos(angle) * radius;
      let pz = Math.sin(angle) * radius;
      
      // Clear the runway for the camera's intro push-through (X near 0, Z > 60)
      if (Math.abs(px) < 15 && pz > 50) {
         px += (px >= 0 ? 25 : -25);
      }
      
      dummy.position.set(px, -20 + Math.random() * 40, pz);
      dummy.rotation.set(0, angle, 0); 
      dummy.scale.set(1, 1.5 + Math.random() * 1.5, 1); // Taller pillars
      
      dummy.updateMatrix();
      pillarRef.current.setMatrixAt(i, dummy.matrix);
    }
    pillarRef.current.instanceMatrix.needsUpdate = true;

    // 2. BEAMS (The Structure)
    for (let i = 0; i < beamCount; i++) {
      let bx = (Math.random() - 0.5) * 120; // Wider spread
      let bz = (Math.random() - 0.5) * 120;
      
      // Clear runway
      if (Math.abs(bx) < 15 && bz > 50) {
         bx += (bx >= 0 ? 25 : -25);
      }
      
      dummy.position.set(bx, -30 + Math.random() * 100, bz);
      
      // Mostly orthographic rotations (0, 90, 180 deg)
      dummy.rotation.set(
        0,
        (Math.floor(Math.random() * 4) * Math.PI) / 2,
        0
      );
      
      // ESCHER RULE: 2 impossible beams that cross at strange vertical angles
      if (i < 2) {
         dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      }

      dummy.scale.set(0.5 + Math.random(), 1, 1);
      dummy.updateMatrix();
      beamRef.current.setMatrixAt(i, dummy.matrix);
    }
    beamRef.current.instanceMatrix.needsUpdate = true;

    // 3. PLATFORMS (The 4 Stations + Extras)
    for (let i = 0; i < platformCount; i++) {
      const angle = (i / platformCount) * Math.PI * 2;
      const radius = 25 + Math.random() * 10;
      
      // Platforms are generally closer to center (radius ~25-35), so they shouldn't block Z>50
      dummy.position.set(
        Math.cos(angle) * radius,
        -15 + (i * 8), // Staggered upwards
        Math.sin(angle) * radius
      );
      
      dummy.rotation.set(0, angle, 0);
      dummy.scale.set(1 + Math.random() * 0.5, 1, 1 + Math.random() * 0.5);
      
      dummy.updateMatrix();
      platformRef.current.setMatrixAt(i, dummy.matrix);
    }
    platformRef.current.instanceMatrix.needsUpdate = true;

    // 4. STAIRCASES
    for (let i = 0; i < stairCount; i++) {
      const angle = (i / stairCount) * Math.PI * 2;
      const radius = 50 + Math.random() * 10; // Pushed outward
      
      let sx = Math.cos(angle) * radius;
      let sz = Math.sin(angle) * radius;
      
      // Clear runway
      if (Math.abs(sx) < 15 && sz > 50) {
         sx += (sx >= 0 ? 25 : -25);
      }
      
      dummy.position.set(sx, -20 + (i * 8), sz);
      
      // Slope the box to look like a staircase silhouette
      const slope = Math.PI / 4; // 45 degrees
      dummy.rotation.set(slope, angle, 0);
      
      // ESCHER RULE: 2 inverted staircases (upside down)
      if (i < 2) {
         dummy.rotation.set(-slope, angle, Math.PI); // Upside down and backward
      }

      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      stairRef.current.setMatrixAt(i, dummy.matrix);
    }
    stairRef.current.instanceMatrix.needsUpdate = true;

  }, []);

  return (
    <group>
      {/* 1. Kill the grid, give the floor real material */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -60, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.35} 
          metalness={0.6} 
          envMapIntensity={0.4}
        />
      </mesh>
      
      {/* The Monolith (Initial Camera Occlusion for Intro Reveal) */}
      <mesh position={[0, 50, 95]}>
        {/* Massive flat wall to block the architecture. Camera pushes straight through it. */}
        <boxGeometry args={[400, 400, 1]} />
        <meshBasicMaterial color="#020202" />
      </mesh>
      
      {/* The Instances */}
      <instancedMesh ref={pillarRef} args={[undefined, undefined, pillarCount]}>
        <boxGeometry args={PILLAR_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={beamRef} args={[undefined, undefined, beamCount]}>
        <boxGeometry args={BEAM_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={platformRef} args={[undefined, undefined, platformCount]}>
        <boxGeometry args={PLATFORM_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={stairRef} args={[undefined, undefined, stairCount]}>
        <boxGeometry args={STAIR_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      {/* 4. PCB Traces — sparse, pointing toward the core */}
      <group>
        {/* Trace on ANC pillar pointing to center */}
        <CircuitTrace color="#ffffff" pathPoints={[
          [-23.5, 40, 13.5],
          [-23.5, 0, 13.5],
          [-23.5, 0, 0],
          [-10, 0, 0]
        ]} />
        
        {/* Trace on Network pillar */}
        <CircuitTrace color="#3388ff" pathPoints={[
          [23.5, -40, 18.5],
          [23.5, -15, 18.5],
          [23.5, -15, 0],
          [10, -15, 0]
        ]} />
        
        {/* Trace on Logic pillar */}
        <CircuitTrace color="#ff3333" pathPoints={[
          [-18.5, 30, -18.5],
          [-18.5, 10, -18.5],
          [-18.5, 10, 0],
          [-10, 10, 0]
        ]} />
      </group>

      {/* 2. Replace ambient wash with motivated light pools */}
      {/* No ambientLight, allowing shadows to actually be black before rim light hits */}
      
      {/* Color-scripted Hemisphere for the dark-to-light gradient (replaces ambient) */}
      <hemisphereLight 
        ref={hemiRef}
        groundColor="#000000" 
        color="#ffffff" 
        intensity={0.15} 
      />

      {[
        { pos: [-25, -5, 15], color: '#ffffff', station: 'anc', solved: ancSolved }, 
        { pos: [25, -10, 20], color: '#3388ff', station: 'network', solved: networkSolved }, 
        { pos: [30, 15, -5], color: '#ffaa00', station: 'vision', solved: false },   
        { pos: [-20, 10, -20], color: '#ff3333', station: 'logic', solved: logicSolved }, 
      ].map((l, i) => (
        <spotLight
          key={i}
          position={l.pos as [number, number, number]}
          angle={0.45}
          penumbra={0.6}
          intensity={l.solved ? 800 : 300} // Increase intensity to match 'physical' PBR falloff
          color={l.color}
          distance={100}
          decay={1.5}
        />
      ))}
      
      {/* 6. FogExp2 for tighter falloff */}
      <fogExp2 attach="fog" args={['#030303', 0.018]} />
    </group>
  );
}
