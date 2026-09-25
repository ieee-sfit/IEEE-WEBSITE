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

    // 1. PILLARS (24) -> The Perimeter Trench & Anchor Towers
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      
      // Chaotic: Blasted into an outer ring, tilted outward like a blown-open wall
      const cRadius = 100 + (i % 2) * 15; 
      let cPx = Math.cos(angle) * cRadius;
      let cPz = Math.sin(angle) * cRadius;
      dummyC.position.set(cPx, -30, cPz);
      dummyC.rotation.set(Math.PI / 2.2, angle + Math.PI/2, 0); // Lay them almost flat
      dummyC.scale.set(1.5, 1.5, 1.5);
      dummyC.updateMatrix();
      pillars.chaotic.push(dummyC.matrix.clone());

      // Canonical: Two Colossal Mechanical Claws Reaching Down
      const isLeft = i < 12;
      const fingerIdx = Math.floor((i % 12) / 4); // 3 prongs per claw
      const jointIdx = i % 4; // 4 segments per prong

      const sign = isLeft ? -1 : 1;
      
      const rig = new THREE.Object3D();
      // Claw base position (High up in the ceiling)
      rig.position.set(sign * 45, 95, 0);
      
      // Point the base straight down, then tilt inward 22.5 degrees
      rig.rotation.set(Math.PI, 0, -sign * Math.PI / 8); 

      // Splay the 3 prongs evenly (120 degrees apart) around the Y axis
      // Offset the right claw by 60 degrees so the fingers interlock perfectly like gears
      const prongOffset = isLeft ? 0 : Math.PI / 3;
      const splay = prongOffset + (fingerIdx / 3) * Math.PI * 2;
      rig.rotateY(splay);

      let currentJoint = rig;
      const jointLength = 32; 
      const curl = 0.28; // Curl inward (pitch around local X)

      // Build the kinematic chain
      for (let j = 0; j <= jointIdx; j++) {
        const nextJoint = new THREE.Object3D();
        if (j > 0) nextJoint.position.set(0, jointLength, 0);
        
        // Snapping the final segment inward sharply to form a cage
        const extraCurl = j === 3 ? 0.45 : 0;
        nextJoint.rotation.set(curl + extraCurl, 0, 0);
        
        currentJoint.add(nextJoint);
        currentJoint = nextJoint;
      }

      // Visual offset
      const visual = new THREE.Object3D();
      visual.position.set(0, jointLength / 2, 0);
      currentJoint.add(visual);

      rig.updateMatrixWorld(true);
      
      dummyK.matrix.copy(visual.matrixWorld);
      
      // Scale and taper
      const baseScale = new THREE.Vector3(3.0, jointLength / 80, 3.0);
      const taper = 1 - (jointIdx * 0.15); 
      baseScale.x *= taper;
      baseScale.z *= taper;
      
      dummyK.matrix.multiply(new THREE.Matrix4().makeScale(baseScale.x, baseScale.y, baseScale.z));
      
      pillars.canonical.push(dummyK.matrix.clone());
    }

    // 2. BEAMS (36) -> The Massive Mechanical Arms Extending Upward
    for (let i = 0; i < beamCount; i++) {
      // Chaotic: Sheared and frozen mid-air far away
      const angle = (i / beamCount) * Math.PI * 2;
      const cRadius = 80 + (i % 3) * 25;
      dummyC.position.set(Math.cos(angle) * cRadius, 40 + (i % 2) * 20, Math.sin(angle) * cRadius);
      dummyC.rotation.set(0, angle + Math.PI/4, Math.PI / 4); // Angled spin
      dummyC.scale.set(1, 1, 1);
      dummyC.updateMatrix();
      beams.chaotic.push(dummyC.matrix.clone());

      // Canonical: Heavy armored cylinders extending up out of frame
      const isLeft = i < 18;
      const sign = isLeft ? -1 : 1;
      const beamIdx = i % 18;

      const armAngle = (beamIdx / 18) * Math.PI * 2;
      const radius = 16;
      const height = 110 + (beamIdx % 6) * 35; // Stretching infinitely upwards

      dummyK.position.set(sign * 45 + Math.cos(armAngle) * radius, height, Math.sin(armAngle) * radius);
      
      // Point them vertically, tilt slightly inward to match arm trajectory
      dummyK.rotation.set(0, armAngle, sign * Math.PI / 16);
      dummyK.scale.set(1.5, 4.5, 1.5);
      
      dummyK.updateMatrix();
      beams.canonical.push(dummyK.matrix.clone());
    }

    // 3. PLATFORMS (8) -> The Heavy Wrist Joints
    for (let i = 0; i < platformCount; i++) {
      // Chaotic: Pushed to the ground layer far out
      const angle = (i / platformCount) * Math.PI * 2;
      const cRadius = 70 + (i % 2) * 20;
      dummyC.position.set(Math.cos(angle) * cRadius, -40 + (i % 3) * 10, Math.sin(angle) * cRadius);
      dummyC.rotation.set(0, angle, Math.PI / 8); 
      dummyC.scale.set(1.5, 1, 1.5);
      dummyC.updateMatrix();
      platforms.chaotic.push(dummyC.matrix.clone());

      // Canonical: Stacked octagonal plates acting as the wrist joint connecting arm to claw
      const isLeft = i < 4;
      const sign = isLeft ? -1 : 1;
      const palmIdx = i % 4;

      dummyK.position.set(sign * 45, 100 - (palmIdx * 4), 0);
      dummyK.rotation.set(0, palmIdx * Math.PI / 4, -sign * Math.PI / 8); 
      dummyK.scale.set(3.8, 1.5, 3.8); 
      
      dummyK.updateMatrix();
      platforms.canonical.push(dummyK.matrix.clone());
    }

    // 4. STAIRCASES (12) -> The Razor Sharp Pincer Tips
    for (let i = 0; i < stairCount; i++) {
      const angle = (i / stairCount) * Math.PI * 2;
      
      // Chaotic: Disconnected bridges hanging in the void
      const cRadius = 90;
      dummyC.position.set(Math.cos(angle) * cRadius, -10 + (i % 2) * 20, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.PI / 6, angle, Math.PI / 2); // Twisted
      dummyC.scale.set(1, 1, 1);
      dummyC.updateMatrix();
      stairs.chaotic.push(dummyC.matrix.clone());

      // Canonical: 2 Pincers per claw tip
      const isLeft = i < 6;
      const sign = isLeft ? -1 : 1;
      const fingerIdx = Math.floor((i % 6) / 2); 
      const clawSide = i % 2 === 0 ? 1 : -1;

      // Re-run the exact FK chain to the 4th joint
      const rig = new THREE.Object3D();
      rig.position.set(sign * 45, 95, 0);
      rig.rotation.set(Math.PI, 0, -sign * Math.PI / 8); 
      
      const prongOffset = isLeft ? 0 : Math.PI / 3;
      rig.rotateY(prongOffset + (fingerIdx / 3) * Math.PI * 2);

      let currentJoint = rig;
      const jointLength = 32; 
      const curl = 0.28; 

      for (let j = 0; j <= 3; j++) {
        const nextJoint = new THREE.Object3D();
        if (j > 0) nextJoint.position.set(0, jointLength, 0);
        const extraCurl = j === 3 ? 0.45 : 0;
        nextJoint.rotation.set(curl + extraCurl, 0, 0);
        currentJoint.add(nextJoint);
        currentJoint = nextJoint;
      }

      const claw = new THREE.Object3D();
      // Spread them left and right along local X axis
      claw.position.set(clawSide * 3.5, jointLength, 0); 
      // Pitch down, and roll inward to pinch together
      claw.rotation.set(Math.PI / 4, 0, clawSide * Math.PI / 4); 
      currentJoint.add(claw);

      rig.updateMatrixWorld(true);
      
      dummyK.matrix.copy(claw.matrixWorld);
      dummyK.matrix.multiply(new THREE.Matrix4().makeScale(0.8, 2.5, 1.5));
      
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
      {/* The Monolith (Initial Camera Occlusion for Intro Reveal - 0.75% scroll) */}
      {(!ancSolved || !networkSolved || !visionSolved || !logicSolved) && (
        <mesh position={[0, 50, 145]}>
          <boxGeometry args={[400, 400, 1]} />
          <meshBasicMaterial color="#020202" />
        </mesh>
      )}

      {/* Floor & Deep Void */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -60, 0]}>
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
      

      
      {/* The Instances */}
      <instancedMesh ref={pillarRef} args={[undefined, undefined, pillarCount]} castShadow receiveShadow>
        <boxGeometry args={PILLAR_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={beamRef} args={[undefined, undefined, beamCount]} castShadow receiveShadow>
        <boxGeometry args={BEAM_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={platformRef} args={[undefined, undefined, platformCount]} castShadow receiveShadow>
        <boxGeometry args={PLATFORM_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={stairRef} args={[undefined, undefined, stairCount]} castShadow receiveShadow>
        <boxGeometry args={STAIR_SIZE} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      {/* Basic Architecture Lighting (Restored cinematic shadows) */}
      
      {/* Key spotlight shining down on the brutalist geometry */}
      <directionalLight 
        castShadow
        position={[40, 100, 60]} 
        intensity={ancSolved ? 4.5 : 3.0} 
        color="#ffffff" 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={250}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005}
      />
      
      {/* Harsh stark rim light from the opposite side (Emergency Lockdown) */}
      <directionalLight 
        position={[-60, 10, -60]} 
        intensity={logicSolved ? 0.0 : 0.8} 
        color="#ff2222" 
      />
      
      {/* Secondary stark blue/white rim light to create cinematic contrast (Data Infrastructure) */}
      <directionalLight 
        position={[60, 0, -20]} 
        intensity={networkSolved ? 1.0 : 0.2} 
        color="#88ccff" 
      />
      
      <hemisphereLight groundColor="#000000" color={logicSolved ? "#15171c" : "#1a0505"} intensity={0.2} />
      
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
