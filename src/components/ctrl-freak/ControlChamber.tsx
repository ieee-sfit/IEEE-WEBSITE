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

    // 1. PILLARS (24) -> Fingers
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      
      // Chaotic: Shattered debris floating far away in the void
      const cRadius = 140 + Math.random() * 80; // Pushed far back
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      // Scale down randomly so they don't block the screen
      dummyC.scale.set(Math.random() * 0.8 + 0.5, Math.random() * 0.3 + 0.1, Math.random() * 0.8 + 0.5); 
      dummyC.updateMatrix();
      pillars.chaotic.push(dummyC.matrix.clone());

      // Canonical: Thick fingers (4 per hand, 3 joints each)
      // CRITICAL: These positions define the finger bases and MUST match the stair-claw FK chain
      // KEY CONSTRAINT: Left hand stays X<0, Right hand stays X>0. They NEVER overlap.
      const isLeft = i < 12;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 12);
      
      const fingerIdx = Math.floor(localI / 3); // 0-3
      const jointIdx = localI % 3; // 0, 1, 2
      
      const rig = new THREE.Object3D();
      
      // Fingers anchor at the wrist (X=±38) and reach inward but NEVER cross X=0
      const fingerPositions = [
        [sign * 36, 6, 8],     // 0: Bottom — cups under the core
        [sign * 36, 30, 0],    // 1: Top — reaches over the top
        [sign * 38, 22, 6],    // 2: Upper-mid
        [sign * 36, 14, -4],   // 3: Lower-mid
      ];
      
      const fp = fingerPositions[fingerIdx];
      rig.position.set(fp[0], fp[1], fp[2]);
      rig.lookAt(0, fp[1] * 0.5, 0);
      
      // Gentle wrap — fingers reach inward but don't cross center
      const fingerOrient = [
        { pitch: 0.5, yaw: sign * 0.1 },        // Bottom: curls up slightly
        { pitch: -0.4, yaw: sign * -0.03 },      // Top: curls down slightly
        { pitch: -0.1, yaw: sign * 0.03 },        // Upper-mid: nearly straight
        { pitch: 0.3, yaw: sign * -0.03 },        // Lower-mid: curls up slightly
      ];
      
      rig.rotateX(fingerOrient[fingerIdx].pitch);
      rig.rotateY(fingerOrient[fingerIdx].yaw);

      let currentJoint = rig;
      const jointLength = 12;
      
      // REDUCED curl — fingers reach toward core but stop at ~X=±10
      const curlAmounts = [0.28, 0.28, 0.25, 0.27];
      const curl = curlAmounts[fingerIdx];

      for (let j = 0; j <= jointIdx; j++) {
        const nextJoint = new THREE.Object3D();
        if (j > 0) nextJoint.position.set(0, jointLength, 0);
        nextJoint.rotation.set(curl, 0, 0); 
        currentJoint.add(nextJoint);
        currentJoint = nextJoint;
      }

      const visual = new THREE.Object3D();
      visual.position.set(0, jointLength / 2, 0);
      currentJoint.add(visual);

      rig.updateMatrixWorld(true);
      dummyK.matrix.copy(visual.matrixWorld);
      
      const taper = 1 - (jointIdx * 0.12);
      dummyK.matrix.multiply(new THREE.Matrix4().makeScale(2.0 * taper, jointLength / 80, 2.0 * taper));
      
      pillars.canonical.push(dummyK.matrix.clone());
    }

    // 2. BEAMS (36) -> Two separate forearm trunks from the upper sides
    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2;
      const cRadius = 150 + Math.random() * 100;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 200, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      beams.chaotic.push(dummyC.matrix.clone());

      // Canonical: Arms come from the UPPER SIDES (like the reference)
      const isLeft = i < 18;
      const sign = isLeft ? -1 : 1;
      const cableIdx = isLeft ? i : (i - 18);
      
      // Origin: Far up and wide to the sides
      const start = new THREE.Vector3(sign * 80, 100, -15); 
      // End: Wrists far from center
      const end = new THREE.Vector3(sign * 40, 18, 0); 
      
      const segment = Math.floor(cableIdx / 6);
      const bundleIdx = cableIdx % 6;
      
      const tStart = segment / 3;
      const tEnd = (segment + 1) / 3;
      
      const pStart = new THREE.Vector3().lerpVectors(start, end, tStart);
      const pEnd = new THREE.Vector3().lerpVectors(start, end, tEnd);
      const mid = new THREE.Vector3().lerpVectors(pStart, pEnd, 0.5);
      
      const bundleRadius = THREE.MathUtils.lerp(14, 6, tStart);
      const bAngle = (bundleIdx / 6) * Math.PI * 2;
      
      const tempRig = new THREE.Object3D();
      tempRig.position.copy(mid);
      tempRig.lookAt(pEnd);
      
      tempRig.translateX(Math.cos(bAngle) * bundleRadius);
      tempRig.translateY(Math.sin(bAngle) * bundleRadius);
      
      dummyK.position.copy(tempRig.position);
      
      tempRig.lookAt(pEnd);
      tempRig.rotateY(Math.PI / 2);
      
      dummyK.rotation.copy(tempRig.rotation);
      dummyK.scale.set(1.2, 2.0, 2.0);
      
      dummyK.updateMatrix();
      beams.canonical.push(dummyK.matrix.clone());
    }

    // 3. PLATFORMS (8) -> Wrist blocks at X=±40
    for (let i = 0; i < platformCount; i++) {
      const angle = (i / platformCount) * Math.PI * 2;
      const cRadius = 130 + Math.random() * 70;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 150, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 2 + 1, Math.random() * 1.5 + 0.5, Math.random() * 2 + 1);
      dummyC.updateMatrix();
      platforms.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 4;
      const sign = isLeft ? -1 : 1;
      const plateIdx = i % 4;
      
      const rig = new THREE.Object3D();
      // Wrist casing at X=±40
      rig.position.set(sign * 40, 16 + (plateIdx - 1.5) * 4, (plateIdx % 2) * 3 - 1.5); 
      rig.lookAt(0, 10, 0);
      
      rig.rotateX(Math.PI / 2);
      rig.rotateX((plateIdx - 1.5) * 0.12);
      
      dummyK.position.copy(rig.position);
      dummyK.rotation.copy(rig.rotation);
      
      dummyK.scale.set(1.8, 2.0, 1.8);
      
      dummyK.updateMatrix();
      platforms.canonical.push(dummyK.matrix.clone());
    }

    // 4. STAIRCASES (12) -> Claw tips + knuckle armor
    for (let i = 0; i < stairCount; i++) {
      const angle = (i / stairCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      stairs.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 6;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 6);

      if (localI < 4) {
        const fingerIdx = localI;
        
        // SAME positions as pillars
        const fingerPositions = [
          [sign * 36, 6, 8],
          [sign * 36, 30, 0],
          [sign * 38, 22, 6],
          [sign * 36, 14, -4],
        ];
        const fingerOrient = [
          { pitch: 0.5, yaw: sign * 0.1 },
          { pitch: -0.4, yaw: sign * -0.03 },
          { pitch: -0.1, yaw: sign * 0.03 },
          { pitch: 0.3, yaw: sign * -0.03 },
        ];
        const curlAmounts = [0.28, 0.28, 0.25, 0.27];
        
        const rig = new THREE.Object3D();
        const fp = fingerPositions[fingerIdx];
        rig.position.set(fp[0], fp[1], fp[2]);
        rig.lookAt(0, fp[1] * 0.5, 0);
        rig.rotateX(fingerOrient[fingerIdx].pitch);
        rig.rotateY(fingerOrient[fingerIdx].yaw);

        let currentJoint = rig;
        const jointLength = 12;
        const curl = curlAmounts[fingerIdx];

        for (let j = 0; j <= 2; j++) {
          const nextJoint = new THREE.Object3D();
          if (j > 0) nextJoint.position.set(0, jointLength, 0);
          nextJoint.rotation.set(curl, 0, 0);
          currentJoint.add(nextJoint);
          currentJoint = nextJoint;
        }

        const claw = new THREE.Object3D();
        claw.position.set(0, jointLength, 0); 
        claw.rotation.set(0.4, 0, 0); 
        currentJoint.add(claw);

        rig.updateMatrixWorld(true);
        const m = new THREE.Matrix4();
        m.copy(claw.matrixWorld);
        
        m.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        m.multiply(new THREE.Matrix4().makeScale(1.2, 2.0, 0.5)); 
        dummyK.matrix.copy(m);
      } else {
        const knuckleIdx = localI - 4;
        dummyK.position.set(sign * 42, knuckleIdx === 0 ? 26 : 12, -4);
        
        dummyK.lookAt(0, 10, 0);
        dummyK.rotateX(Math.PI / 2);
        
        dummyK.rotateX(knuckleIdx === 0 ? 0.3 : -0.3);
        dummyK.scale.set(2.0, 2.5, 2.0);
        
        const m = new THREE.Matrix4();
        m.makeRotationFromEuler(dummyK.rotation);
        m.setPosition(dummyK.position);
        m.scale(dummyK.scale);
        dummyK.matrix.copy(m);
      }
      
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
        count: number,
        localProgress: number
      ) => {
        for (let i = 0; i < count; i++) {
          data.chaotic[i].decompose(posC, quatC, scaleC);
          data.canonical[i].decompose(posK, quatK, scaleK);

          // Use a custom easing function to make the snapping feel weighty and mechanical
          const easeProgress = 1 - Math.pow(1 - localProgress, 3); // Cubic Out

          dummy.position.lerpVectors(posC, posK, easeProgress);
          dummy.quaternion.slerpQuaternions(quatC, quatK, easeProgress);
          dummy.scale.lerpVectors(scaleC, scaleK, easeProgress);
          
          dummy.updateMatrix();
          ref.current!.setMatrixAt(i, dummy.matrix);
        }
        ref.current!.instanceMatrix.needsUpdate = true;
      };

      const p = currentStability.current;
      const mapProgress = (val: number, start: number, end: number) => THREE.MathUtils.clamp((val - start) / (end - start), 0, 1);
      
      // STAGED ANIMATION: As stability increases, pieces assemble in sequence
      const progressBeams = mapProgress(p, 0.0, 0.4);      // Forearms sweep in from the darkness
      const progressPlatforms = mapProgress(p, 0.2, 0.6);  // Palms rotate into place behind the core
      const progressPillars = mapProgress(p, 0.4, 0.85);   // Fingers close aggressively around the core
      const progressStairs = mapProgress(p, 0.6, 1.0);     // Thumb and Claws lock into position

      interpolateInstances(beamRef, transforms.beams, beamCount, progressBeams);
      interpolateInstances(platformRef, transforms.platforms, platformCount, progressPlatforms);
      interpolateInstances(pillarRef, transforms.pillars, pillarCount, progressPillars);
      interpolateInstances(stairRef, transforms.stairs, stairCount, progressStairs);
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
      <fog attach="fog" args={['#050505', 80, 300]} />
    </group>
  );
}
