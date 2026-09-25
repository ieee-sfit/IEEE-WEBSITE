import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

// Procedural Vocabulary Geometry Sizes
const PILLAR_SIZE: [number, number, number] = [3, 80, 3];
const BEAM_SIZE: [number, number, number] = [40, 2, 2];
const PLATFORM_SIZE: [number, number, number] = [12, 1, 12];
const STAIR_SIZE: [number, number, number] = [4, 0.5, 15]; // Represented as a slanted box for silhouette

// The single, flat, dark concrete material (as requested, no heavy textures yet)
const brutalistMaterial = new THREE.MeshStandardMaterial({
  color: '#1a1a1a',
  roughness: 0.9,
  metalness: 0.1,
});

export function ControlChamber() {
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
      {/* Floor & Deep Void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -60, 0]}>
        <circleGeometry args={[250, 32]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>
      
      {/* Subtle Structural Floor Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[80, 82, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[140, 142, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[200, 205, 64]} />
        <meshBasicMaterial color="#ff3333" transparent opacity={0.02} />
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

      {/* Basic Architecture Lighting (No real-time shadows yet) */}
      <ambientLight intensity={0.1} />
      
      {/* Key spotlight shining down and angled slightly to give the pillars bright faces */}
      <directionalLight 
        position={[20, 80, 40]} 
        intensity={ancSolved ? 3.5 : 2.5} 
        color="#ffffff" 
      />
      
      {/* Harsh stark rim light from the opposite side (Emergency Lockdown) */}
      <directionalLight 
        position={[-50, 20, -50]} 
        intensity={logicSolved ? 0.2 : 1.0} 
        color="#ff3333" 
      />
      
      {/* Secondary stark blue/white rim light to create cinematic contrast (Data Infrastructure) */}
      <directionalLight 
        position={[60, 0, -20]} 
        intensity={networkSolved ? 2.5 : 1.5} 
        color="#88ccff" 
      />
      
      <hemisphereLight groundColor="#000000" color="#222222" intensity={0.3} />
      
      {/* Tiny red emissive strips (Floating warning lamps) */}
      <mesh position={[-25, 15, -15]}>
         <boxGeometry args={[6, 0.2, 0.2]} />
         <meshStandardMaterial color="#330000" emissive="#ff1111" emissiveIntensity={5} />
      </mesh>
      <mesh position={[35, 5, -25]} rotation={[0, Math.PI/4, 0]}>
         <boxGeometry args={[4, 0.2, 0.2]} />
         <meshStandardMaterial color="#002233" emissive="#00ddff" emissiveIntensity={5} />
      </mesh>
      
      {/* Dense fog pushed back so we can actually see the chamber */}
      <fog attach="fog" args={['#050505', 40, 180]} />
    </group>
  );
}
