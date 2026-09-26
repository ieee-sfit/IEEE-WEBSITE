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

      // Canonical: Thick Industrial Robot Fingers (4 per hand, 3 joints each)
      const isLeft = i < 12;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 12);
      
      const fingerIdx = Math.floor(localI / 3); // 0 (Thumb), 1 (Top), 2 (Mid), 3 (Bottom)
      const jointIdx = localI % 3; // 0, 1, 2
      
      const rig = new THREE.Object3D();
      
      // Wrists are at x: ±25, y: 15. The fingers anchor near here and reach inwards to the core.
      if (fingerIdx === 0) {
        // Thumb (Bottom front)
        rig.position.set(sign * 18, -2, 5);
        rig.lookAt(0, 0, 0); // Z points at core, Y points roughly UP
        rig.rotateX(Math.PI / 3); // Pitch Y towards core
        rig.rotateY(sign * 0.4); // Splay outwards
      } else if (fingerIdx === 1) {
        // Top finger
        rig.position.set(sign * 20, 15, -4);
        rig.lookAt(0, 0, 0);
        rig.rotateX(-Math.PI / 6); // Pitch Y downwards towards core
        rig.rotateY(sign * -0.1); 
      } else if (fingerIdx === 2) {
        // Mid finger
        rig.position.set(sign * 23, 8, 2);
        rig.lookAt(0, 0, 0);
        rig.rotateZ(sign * Math.PI / 2); // Roll so Y points horizontally
        rig.rotateX(-Math.PI / 6); // Pitch Y inwards towards core
      } else {
        // Bottom finger
        rig.position.set(sign * 21, 2, -6);
        rig.lookAt(0, 0, 0);
        rig.rotateX(Math.PI / 4);
        rig.rotateY(sign * 0.1);
      }

      let currentJoint = rig;
      const jointLength = 10; // Short, thick industrial joints
      
      let curl = 0.4;
      if (fingerIdx === 0) curl = 0.5; // Thumb locks tight
      if (fingerIdx === 1) curl = 0.45; 
      if (fingerIdx === 2) curl = 0.35; 

      for (let j = 0; j <= jointIdx; j++) {
        const nextJoint = new THREE.Object3D();
        if (j > 0) nextJoint.position.set(0, jointLength, 0);
        // Curl directly towards the core (bend Y towards Z)
        nextJoint.rotation.set(curl, 0, 0); 
        currentJoint.add(nextJoint);
        currentJoint = nextJoint;
      }

      const visual = new THREE.Object3D();
      visual.position.set(0, jointLength / 2, 0);
      currentJoint.add(visual);

      rig.updateMatrixWorld(true);
      dummyK.matrix.copy(visual.matrixWorld);
      
      const taper = 1 - (jointIdx * 0.15);
      // Ensure they look like thick, heavy industrial pistons
      dummyK.matrix.multiply(new THREE.Matrix4().makeScale(2.5 * taper, jointLength / 80, 2.5 * taper));
      
      pillars.canonical.push(dummyK.matrix.clone());
    }

    // 2. BEAMS (36) -> Colossal Cable-Braided Forearms
    for (let i = 0; i < beamCount; i++) {
      // Chaotic: Scattered cables frozen mid-air
      const angle = (i / beamCount) * Math.PI * 2;
      const cRadius = 150 + Math.random() * 100;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 200, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      beams.chaotic.push(dummyC.matrix.clone());

      // Canonical: Massive cables forming the forearms sweeping down from the sky
      const isLeft = i < 18;
      const sign = isLeft ? -1 : 1;
      const cableIdx = isLeft ? i : (i - 18);
      
      // Origin: High up, off-screen to the left/right, coming downwards
      const start = new THREE.Vector3(sign * 70, 120, -10); 
      // End: Wrists hovering well outside the core
      const end = new THREE.Vector3(sign * 25, 15, -5); 
      
      // Create a bundled cylinder of cables using 3 lengthwise segments of 6 bundled cables
      const segment = Math.floor(cableIdx / 6); // 0, 1, 2
      const bundleIdx = cableIdx % 6;
      
      const tStart = segment / 3;
      const tEnd = (segment + 1) / 3;
      
      const pStart = new THREE.Vector3().lerpVectors(start, end, tStart);
      const pEnd = new THREE.Vector3().lerpVectors(start, end, tEnd);
      const mid = new THREE.Vector3().lerpVectors(pStart, pEnd, 0.5);
      
      // Taper the arm: thickest at the top, narrowing at the wrists
      const bundleRadius = THREE.MathUtils.lerp(12, 5, tStart);
      const bAngle = (bundleIdx / 6) * Math.PI * 2;
      
      const tempRig = new THREE.Object3D();
      tempRig.position.copy(mid);
      tempRig.lookAt(pEnd);
      
      // Offset out from the center line to form a solid tube
      tempRig.translateX(Math.cos(bAngle) * bundleRadius);
      tempRig.translateY(Math.sin(bAngle) * bundleRadius);
      
      dummyK.position.copy(tempRig.position);
      
      // Re-target to align exactly with the path flow
      tempRig.lookAt(pEnd);
      // Beam base geometry is long along X (40x2x2). We must rotate Y by 90deg to align X to Z.
      tempRig.rotateY(Math.PI / 2);
      
      dummyK.rotation.copy(tempRig.rotation);
      dummyK.scale.set(1.5, 2.5, 2.5); // Thicker solid cables
      
      dummyK.updateMatrix();
      beams.canonical.push(dummyK.matrix.clone());
    }

    // 3. PLATFORMS (8) -> Giant Cupped Palms
    for (let i = 0; i < platformCount; i++) {
      // Chaotic: Massive plates tumbling in the distance
      const angle = (i / platformCount) * Math.PI * 2;
      const cRadius = 130 + Math.random() * 70;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 150, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 2 + 1, Math.random() * 1.5 + 0.5, Math.random() * 2 + 1);
      dummyC.updateMatrix();
      platforms.chaotic.push(dummyC.matrix.clone());

      // Canonical: 4 plates heavily overlapping to form a solid wrist/palm base
      const isLeft = i < 4;
      const sign = isLeft ? -1 : 1;
      const plateIdx = i % 4;
      
      const rig = new THREE.Object3D();
      // Attach them directly at the wrists where the forearms end (X = ±25)
      rig.position.set(sign * 23, 10 + (plateIdx - 1.5) * 3, -4 + (plateIdx % 2) * 1.5); 
      rig.lookAt(0, 0, 0);
      
      // Platform is 12x1x12 (Flat on Y). We want the flat face to face the core (Z).
      rig.rotateX(Math.PI / 2);
      
      // Pitch slightly to curve the armor wall around the core
      rig.rotateX((plateIdx - 1.5) * 0.15);
      
      dummyK.position.copy(rig.position);
      dummyK.rotation.copy(rig.rotation);
      
      // Bulk up the wrist blocks
      dummyK.scale.set(1.5, 1.8, 1.5); // 18x1.8x18 thick armor plates
      
      dummyK.updateMatrix();
      platforms.canonical.push(dummyK.matrix.clone());
    }

    // 4. STAIRCASES (12) -> Sharp Fingertips and Knuckles
    for (let i = 0; i < stairCount; i++) {
      // Chaotic: Sharp debris
      const angle = (i / stairCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.set(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      stairs.chaotic.push(dummyC.matrix.clone());

      // Canonical: 4 Claws + 2 Knuckle Armors per hand
      const isLeft = i < 6;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 6);

      if (localI < 4) {
        // Claws on the 4 fingertips (run the FK chain to the 3rd joint)
        const fingerIdx = localI;
        
        const rig = new THREE.Object3D();
        if (fingerIdx === 0) {
          rig.position.set(sign * 11, -8, -2);
          rig.lookAt(0, 0, 0);
          rig.rotateX(Math.PI / 2.5); 
          rig.rotateY(sign * 0.4);
        } else if (fingerIdx === 1) {
          rig.position.set(sign * 12, 8, -8);
          rig.lookAt(0, 0, 0);
          rig.rotateX(-Math.PI / 4); 
          rig.rotateY(sign * -0.1);
        } else if (fingerIdx === 2) {
          rig.position.set(sign * 16, 0, -4);
          rig.lookAt(0, 0, 0);
          rig.rotateZ(sign * Math.PI / 2); 
          rig.rotateX(-Math.PI / 6);
        } else {
          rig.position.set(sign * 13, -5, -10);
          rig.lookAt(0, 0, 0);
          rig.rotateX(Math.PI / 4);
          rig.rotateY(sign * 0.1);
        }

        let currentJoint = rig;
        const jointLength = 18;
        
        let curl = 0.4;
        if (fingerIdx === 0) curl = 0.5;
        if (fingerIdx === 1) curl = 0.45;
        if (fingerIdx === 2) curl = 0.35;

        for (let j = 0; j <= 2; j++) {
          const nextJoint = new THREE.Object3D();
          if (j > 0) nextJoint.position.set(0, jointLength, 0);
          nextJoint.rotation.set(curl, 0, 0);
          currentJoint.add(nextJoint);
          currentJoint = nextJoint;
        }

        const claw = new THREE.Object3D();
        claw.position.set(0, jointLength, 0); 
        // Snap the pad inward to face the core
        claw.rotation.set(0.6, 0, 0); 
        currentJoint.add(claw);

        rig.updateMatrixWorld(true);
        const m = new THREE.Matrix4();
        m.copy(claw.matrixWorld);
        
        // Stairs are 4 x 0.5 x 15 (Long along Z). 
        // Pad needs to point along Local Y. So rotate X by 90deg.
        m.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        // Flatten into square, blunt magnetic pressure pads instead of claws
        m.multiply(new THREE.Matrix4().makeScale(1.5, 2.5, 0.4)); 
        dummyK.matrix.copy(m);
      } else {
        // 2 Knuckle armor plates on the back of the palm
        const knuckleIdx = localI - 4;
        dummyK.position.set(sign * 25, knuckleIdx === 0 ? 15 : 5, -8);
        
        dummyK.lookAt(0, 0, 0);
        dummyK.rotateX(Math.PI / 2);
        
        // Angled to cover the wrist joint
        dummyK.rotateX(knuckleIdx === 0 ? 0.3 : -0.3);
        dummyK.scale.set(2.5, 3.0, 2.5);
        
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
      <fog attach="fog" args={['#050505', 50, 190]} />
    </group>
  );
}
