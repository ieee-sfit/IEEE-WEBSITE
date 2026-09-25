import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

// Procedural Vocabulary Geometry Sizes
const PILLAR_SIZE: [number, number, number] = [3, 80, 3];
const BEAM_SIZE: [number, number, number] = [40, 2, 2];
const PLATFORM_SIZE: [number, number, number] = [12, 1, 12];
const STAIR_SIZE: [number, number, number] = [4, 0.5, 15]; // Represented as a slanted box for silhouette

// The premium, dark sci-fi material
const brutalistMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff', // Required so instanceColor isn't tinted
  roughness: 0.78,
  metalness: 0.18,
  emissive: '#030405',
  emissiveIntensity: 0.15,
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
  const visionSolved = useCtrlFreakStore(s => s.vision.solved);
  const logicSolved = useCtrlFreakStore(s => s.logic.solved);

  // Keep track of current interpolated stability
  const currentStability = useRef(0);

  const transforms = useMemo(() => {
    const dummyC = new THREE.Object3D(); // Chaotic
    const dummyK = new THREE.Object3D(); // Canonical (Ordered)
    
    const pillars = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const beams = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const platforms = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const stairs = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };

    // 1. PILLARS (The Cage -> The Perimeter)
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      
      // Chaotic: closer in, random heights, visually enclosing
      const cRadius = 70 + Math.random() * 20;
      let cPx = Math.cos(angle) * cRadius;
      let cPz = Math.sin(angle) * cRadius;
      if (Math.abs(cPx) < 15 && cPz > 50) cPx += (cPx >= 0 ? 25 : -25);
      
      dummyC.position.set(cPx, -20 + Math.random() * 40, cPz);
      // Chaotic: slight tilt for instability
      dummyC.rotation.set((Math.random()-0.5)*0.2, angle, (Math.random()-0.5)*0.2); 
      dummyC.scale.set(1, 1.5 + Math.random() * 1.5, 1);
      dummyC.updateMatrix();
      pillars.chaotic.push(dummyC.matrix.clone());

      // Canonical: pulled out to radius 120, perfect upright ring, unified heights
      const kRadius = 120;
      dummyK.position.set(Math.cos(angle) * kRadius, 0, Math.sin(angle) * kRadius);
      dummyK.rotation.set(0, angle, 0);
      dummyK.scale.set(1, 1.5, 1);
      dummyK.updateMatrix();
      pillars.canonical.push(dummyK.matrix.clone());
    }

    // 2. BEAMS (The Structure)
    for (let i = 0; i < beamCount; i++) {
      // Chaotic
      let bx = (Math.random() - 0.5) * 120;
      let bz = (Math.random() - 0.5) * 120;
      if (Math.abs(bx) < 15 && bz > 50) bx += (bx >= 0 ? 25 : -25);
      dummyC.position.set(bx, -30 + Math.random() * 100, bz);
      dummyC.rotation.set(
        0, (Math.floor(Math.random() * 4) * Math.PI) / 2, 0
      );
      if (i < 2) dummyC.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummyC.scale.set(0.5 + Math.random(), 1, 1);
      dummyC.updateMatrix();
      beams.chaotic.push(dummyC.matrix.clone());

      // Canonical: Neat structural rings around the core at 3 heights
      const angle = (i / (beamCount/3)) * Math.PI * 2;
      const heightIndex = i % 3;
      const kRadius = 90;
      dummyK.position.set(Math.cos(angle) * kRadius, -30 + (heightIndex * 40), Math.sin(angle) * kRadius);
      dummyK.rotation.set(0, angle + Math.PI/2, 0); // Tangent to circle
      dummyK.scale.set(1.5, 1, 1);
      dummyK.updateMatrix();
      beams.canonical.push(dummyK.matrix.clone());
    }

    // 3. PLATFORMS
    for (let i = 0; i < platformCount; i++) {
      const angle = (i / platformCount) * Math.PI * 2;
      
      // Chaotic
      const cRadius = 25 + Math.random() * 10;
      dummyC.position.set(Math.cos(angle) * cRadius, -15 + (i * 8), Math.sin(angle) * cRadius);
      dummyC.rotation.set(0, angle, (Math.random()-0.5)*0.3); // Tilted
      dummyC.scale.set(1 + Math.random() * 0.5, 1, 1 + Math.random() * 0.5);
      dummyC.updateMatrix();
      platforms.chaotic.push(dummyC.matrix.clone());

      // Canonical: Flat, exact radial alignment, uniform spacing
      const kRadius = 45;
      dummyK.position.set(Math.cos(angle) * kRadius, -20 + (i * 5), Math.sin(angle) * kRadius);
      dummyK.rotation.set(0, angle, 0);
      dummyK.scale.set(1.2, 1, 1.2);
      dummyK.updateMatrix();
      platforms.canonical.push(dummyK.matrix.clone());
    }

    // 4. STAIRCASES
    for (let i = 0; i < stairCount; i++) {
      const angle = (i / stairCount) * Math.PI * 2;
      
      // Chaotic
      const cRadius = 50 + Math.random() * 10;
      let sx = Math.cos(angle) * cRadius;
      let sz = Math.sin(angle) * cRadius;
      if (Math.abs(sx) < 15 && sz > 50) sx += (sx >= 0 ? 25 : -25);
      dummyC.position.set(sx, -20 + (i * 8), sz);
      const slope = Math.PI / 4;
      dummyC.rotation.set(slope, angle, 0);
      if (i < 2) dummyC.rotation.set(-slope, angle, Math.PI); // Escher upside down
      dummyC.scale.set(1, 1, 1);
      dummyC.updateMatrix();
      stairs.chaotic.push(dummyC.matrix.clone());

      // Canonical: Connecting ramps in a perfect circle
      const kRadius = 65;
      dummyK.position.set(Math.cos(angle) * kRadius, -15 + (i * 5), Math.sin(angle) * kRadius);
      dummyK.rotation.set(0.2, angle + Math.PI/2, 0); // Gentle connecting slope
      dummyK.scale.set(1, 1, 1);
      dummyK.updateMatrix();
      stairs.canonical.push(dummyK.matrix.clone());
    }

    return { pillars, beams, platforms, stairs };
  }, []);

  useFrame((_, delta) => {
    if (!pillarRef.current || !beamRef.current || !platformRef.current || !stairRef.current) return;

    // Calculate target stability (0.0 to 1.0)
    let solvedCount = 0;
    if (ancSolved) solvedCount++;
    if (networkSolved) solvedCount++;
    if (visionSolved) solvedCount++;
    if (logicSolved) solvedCount++;
    const targetStability = solvedCount / 4;

    // Smoothly ease currentStability towards targetStability
    currentStability.current = THREE.MathUtils.lerp(currentStability.current, targetStability, delta * 0.5);

    // Minor optimization: only update matrices if stability is visibly changing or just started
    if (Math.abs(currentStability.current - targetStability) > 0.001 || currentStability.current < 0.01) {
      
      const posC = new THREE.Vector3();
      const quatC = new THREE.Quaternion();
      const scaleC = new THREE.Vector3();
      
      const posK = new THREE.Vector3();
      const quatK = new THREE.Quaternion();
      const scaleK = new THREE.Vector3();
      
      const dummy = new THREE.Object3D();

      const interpolateInstances = (
        ref: React.RefObject<THREE.InstancedMesh>, 
        data: { chaotic: THREE.Matrix4[], canonical: THREE.Matrix4[] }, 
        count: number
      ) => {
        for (let i = 0; i < count; i++) {
          data.chaotic[i].decompose(posC, quatC, scaleC);
          data.canonical[i].decompose(posK, quatK, scaleK);

          dummy.position.lerpVectors(posC, posK, currentStability.current);
          dummy.quaternion.slerpQuaternions(quatC, quatK, currentStability.current);
          dummy.scale.lerpVectors(scaleC, scaleK, currentStability.current);
          
          dummy.updateMatrix();
          ref.current!.setMatrixAt(i, dummy.matrix);
        }
        ref.current!.instanceMatrix.needsUpdate = true;
      };

      interpolateInstances(pillarRef, transforms.pillars, pillarCount);
      interpolateInstances(beamRef, transforms.beams, beamCount);
      interpolateInstances(platformRef, transforms.platforms, platformCount);
      interpolateInstances(stairRef, transforms.stairs, stairCount);
    }
  });

  useEffect(() => {
    if (!pillarRef.current || !beamRef.current || !platformRef.current || !stairRef.current) return;

    // 5. Instanced Color Variation (Depth-based Tonal Hierarchy)
    const applyDepthColor = (ref: React.RefObject<THREE.InstancedMesh>, count: number) => {
      if (!ref.current) return;
      const tempMatrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const cForeground = new THREE.Color('#121519');
      const cMidground = new THREE.Color('#0d1013');
      const cBackground = new THREE.Color('#080a0c');
      
      for (let i = 0; i < count; i++) {
        ref.current.getMatrixAt(i, tempMatrix);
        position.setFromMatrixPosition(tempMatrix);
        
        // Calculate distance from center (0,0,0)
        const dist = position.length();
        
        let color = cMidground;
        if (dist < 40) color = cForeground; // Closer objects are slightly brighter
        else if (dist > 80) color = cBackground; // Far objects fade into the void
        
        // Add tiny bit of random variation so no two blocks are perfectly identical (~2% lightness variance)
        const varColor = color.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.02);
        
        ref.current.setColorAt(i, varColor);
      }
      ref.current.instanceColor!.needsUpdate = true;
    };

    applyDepthColor(pillarRef, pillarCount);
    applyDepthColor(beamRef, beamCount);
    applyDepthColor(platformRef, platformCount);
    applyDepthColor(stairRef, stairCount);

  }, []);

  return (
    <group>
      {/* Floor & Deep Void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -60, 0]}>
        <circleGeometry args={[250, 32]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
      
      {/* Subtle Structural Floor Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[80, 82, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.015} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[140, 142, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.01} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -59.9, 0]}>
        <ringGeometry args={[200, 205, 64]} />
        <meshBasicMaterial color="#ff3333" transparent opacity={0.01} />
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
      {/* ambientLight moved entirely to SystemCore to establish the global floor */}
      
      {/* Key spotlight shining down and angled slightly to give the pillars bright faces */}
      <directionalLight 
        position={[20, 80, 40]} 
        intensity={ancSolved ? 2.5 : 2.0} 
        color="#ffffff" 
      />
      
      {/* Harsh stark rim light from the opposite side (Emergency Lockdown) */}
      <directionalLight 
        position={[-50, 20, -50]} 
        intensity={logicSolved ? 0.05 : 0.25} 
        color="#ff3333" 
      />
      
      {/* Secondary stark blue/white rim light to create cinematic contrast (Data Infrastructure) */}
      <directionalLight 
        position={[60, 0, -20]} 
        intensity={networkSolved ? 0.6 : 0.35} 
        color="#88ccff" 
      />
      
      <hemisphereLight groundColor="#000000" color="#15171c" intensity={0.15} />
      
      {/* Tiny red emissive strips (Floating warning lamps) */}
      <mesh position={[-25, 15, -15]}>
         <boxGeometry args={[6, 0.2, 0.2]} />
         <meshStandardMaterial color="#330000" emissive="#ff1111" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[35, 5, -25]} rotation={[0, Math.PI/4, 0]}>
         <boxGeometry args={[4, 0.2, 0.2]} />
         <meshStandardMaterial color="#002233" emissive="#00ddff" emissiveIntensity={2.5} />
      </mesh>
      
      {/* Dense fog pushed back to create cinematic atmosphere */}
      <fog attach="fog" args={['#050505', 50, 190]} />
    </group>
  );
}
