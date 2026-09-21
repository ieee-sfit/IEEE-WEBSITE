import { useRef, useEffect } from 'react';
import * as THREE from 'three';

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

  useEffect(() => {
    if (!pillarRef.current || !beamRef.current || !platformRef.current || !stairRef.current) return;

    const dummy = new THREE.Object3D();

    // 1. PILLARS (The Octagonal/Circular Shell) - Much wider now
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const radius = 70 + Math.random() * 20; // Expanded perimeter
      
      dummy.position.set(
        Math.cos(angle) * radius,
        -20 + Math.random() * 40, 
        Math.sin(angle) * radius
      );
      dummy.rotation.set(0, angle, 0); 
      dummy.scale.set(1, 1.5 + Math.random() * 1.5, 1); // Taller pillars
      
      dummy.updateMatrix();
      pillarRef.current.setMatrixAt(i, dummy.matrix);
    }
    pillarRef.current.instanceMatrix.needsUpdate = true;

    // 2. BEAMS (The Structure)
    for (let i = 0; i < beamCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 120, // Wider spread
        -30 + Math.random() * 100, // Higher vertical spread
        (Math.random() - 0.5) * 120
      );
      
      // Mostly orthographic rotations (0, 90, 180 deg)
      dummy.rotation.set(
        0,
        (Math.floor(Math.random() * 4) * Math.PI) / 2,
        0
      );
      
      // ESCHER RULE: 2 impossible beams that cross at strange vertical angles defying gravity/structure
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
      
      dummy.position.set(
        Math.cos(angle) * radius,
        -20 + (i * 8),
        Math.sin(angle) * radius
      );
      
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
        intensity={2.5} 
        color="#ffffff" 
      />
      
      {/* Harsh stark rim light from the opposite side */}
      <directionalLight 
        position={[-50, 20, -50]} 
        intensity={1.0} 
        color="#ff3333" 
      />
      
      {/* Secondary stark blue/white rim light to create cinematic contrast */}
      <directionalLight 
        position={[60, 0, -20]} 
        intensity={1.5} 
        color="#88ccff" 
      />
      
      <hemisphereLight groundColor="#000000" color="#222222" intensity={0.3} />
      
      {/* Dense fog pushed back so we can actually see the chamber */}
      <fog attach="fog" args={['#050505', 40, 180]} />
    </group>
  );
}
