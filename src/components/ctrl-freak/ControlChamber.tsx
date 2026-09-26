import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

// Procedural Vocabulary Geometries (Sharp, Abstract, Chitinous)
// Carapace: Tapered 4-sided wedge (radiusTop, radiusBottom, height, radialSegments)
const CARAPACE_ARGS: [number, number, number, number] = [1.5, 3.5, 10, 4];
// Spike: Elongated 4-sided pyramid (radius, height, radialSegments)
const SPIKE_ARGS: [number, number, number] = [1.8, 14, 4];
// Joint: Sharp octahedron/diamond (radius, detail)
const JOINT_ARGS: [number, number] = [2.5, 0];
// ArchSegment: Sweeping massive blocks for the "hanger" (radiusTop, radiusBottom, height, radialSegments)
const ARCH_ARGS: [number, number, number, number] = [3, 3, 20, 4];

// The premium, dark sci-fi material
const brutalistMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff', // Required so instanceColor isn't tinted
  roughness: 0.78,
  metalness: 0.18,
  emissive: '#030405',
  emissiveIntensity: 0.15,
});

export function ControlChamber() {
  const carapaceRef = useRef<THREE.InstancedMesh>(null);
  const spikeRef = useRef<THREE.InstancedMesh>(null);
  const jointRef = useRef<THREE.InstancedMesh>(null);
  const archRef = useRef<THREE.InstancedMesh>(null);

  // Vocabulary limits
  const carapaceCount = 64;
  const spikeCount = 64;
  const jointCount = 48;
  const archCount = 32;

  // React to solved states for lighting changes
  const ancSolved = useCtrlFreakStore(s => s.anc.solved);
  const networkSolved = useCtrlFreakStore(s => s.network.solved);
  const visionSolved = useCtrlFreakStore(s => s.vision.solved);
  const logicSolved = useCtrlFreakStore(s => s.logic.solved);

  // Keep track of current interpolated stability
  const currentStability = useRef(0);

  const transforms = useMemo(() => {
    const dummyC = new THREE.Object3D();
    const dummyK = new THREE.Object3D();
    
    const carapaces = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const spikes = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const joints = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const arches = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };

    // 1. SPIKES (Fingers & Thumbs)
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      dummyC.scale.setScalar(Math.random() * 1.5 + 0.5); 
      dummyC.updateMatrix();
      spikes.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const localI = isLeft ? i : (i - 16);
      
      if (localI < 14) { 
        const isThumb = localI >= 12;
        const fingerIdx = isThumb ? 4 : Math.floor(localI / 3);
        const jointIdx = isThumb ? (localI - 12) : (localI % 3);
        
        const rig = new THREE.Object3D();
        
        // Base knuckles positioned in an asymmetric reaching pose
        let fp, target, curl, jointScale;
        
        if (isLeft) {
          // Gold Arm - Reaching straight in
          const fpLeft = [
            [-30, 12, 5], [-30, 6, 5], [-30, 0, 5], [-30, -6, 5], [-25, 14, -2]
          ];
          const targetsLeft = [
            [0, 12, 5], [0, 6, 5], [0, 0, 5], [0, -6, 5], [-15, 20, 10] // Thumb points up/forward
          ];
          fp = fpLeft[fingerIdx];
          target = targetsLeft[fingerIdx];
          
          curl = 0.05; // Almost perfectly straight fingers
          jointScale = [1.0, 1.05, 0.95, 0.8, 1.2][fingerIdx];
        } else {
          // Dark Purple Arm - Cupping from underneath, fingers splayed wildly
          const fpRight = [
            [34, 4, -5], [35, 1, -2], [36, -2, 2], [37, -5, 8], [36, 4, -12]
          ];
          const targetsRight = [
            [10, 24, -5],  // Index points high up and slightly left
            [10, 14, -2],  // Middle points up and left
            [10, 4, 5],    // Ring points left and slightly forward
            [10, -11, 15], // Pinky points down and forward
            [40, 14, -20]  // Thumb points UP and BACK (away from core)
          ];
          fp = fpRight[fingerIdx];
          target = targetsRight[fingerIdx];
          
          curl = 0.15; // Slight elegant curve
          jointScale = [1.0, 1.05, 0.95, 0.8, 1.2][fingerIdx];
        }

        rig.position.set(fp[0], fp[1], fp[2]);
        rig.lookAt(target[0], target[1], target[2]);
        // Fix for fingers pointing completely backwards (outwards)
        rig.rotateY(Math.PI);
        
        // Slightly curl the fingers "INWARD" relative to their local Up axis
        // Positive X pitches UP (towards local +Y)
        // We want them to curl gently towards their palms. 
        // Right hand palm faces UP/LEFT. If fingers point UP/LEFT, curling +X curls them further UP.
        const curlDir = isLeft ? -1 : 1; 

        let currentJoint = rig;
        const jointLength = isThumb ? 16 : 24; // Massive, long grasping fingers

        for (let j = 0; j <= jointIdx; j++) {
          const nextJoint = new THREE.Object3D();
          if (j > 0) nextJoint.position.set(0, 0, -jointLength * jointScale);
          nextJoint.rotation.set(curl * curlDir, 0, 0); 
          currentJoint.add(nextJoint);
          currentJoint = nextJoint;
        }

        const visual = new THREE.Object3D();
        visual.position.set(0, 0, (-jointLength * jointScale) / 2);
        currentJoint.add(visual);

        rig.updateMatrixWorld(true);
        dummyK.matrix.copy(visual.matrixWorld);
        
        const taper = 1 - (jointIdx * 0.25);
        // Point the Cone (+Y) along the local -Z axis
        dummyK.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // Diamond profile
        dummyK.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 4));
        
        // Beefy, dangerous sharp spikes
        const thickness = 0.8 * taper; 
        const length = (jointLength / 14) * jointScale * 1.1; // 10% overlap
        dummyK.matrix.multiply(new THREE.Matrix4().makeScale(thickness, length, thickness));
        
        spikes.canonical.push(dummyK.matrix.clone());
      } else {
        dummyK.position.set(0, -100, 0);
        dummyK.scale.set(0, 0, 0);
        dummyK.updateMatrix();
        spikes.canonical.push(dummyK.matrix.clone());
      }
    }

    // 2. CARAPACES (Palms and Forearms - Thin Shards)
    for (let i = 0; i < carapaceCount; i++) {
      const angle = (i / carapaceCount) * Math.PI * 2;
      const cRadius = 150 + Math.random() * 100;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 200, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 1.2 + 0.5);
      dummyC.updateMatrix();
      carapaces.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const localI = isLeft ? i : (i - 16);
      
      if (localI < 4) {
        // Imposing Palm Plates (Bulkier)
        const pz = 10 - (localI * 6); 
        if (isLeft) {
          dummyK.position.set(-35, 4, pz);
          dummyK.lookAt(0, 4, pz);
        } else {
          dummyK.position.set(38, -4, pz);
          dummyK.lookAt(0, 14, pz); // Looking up at the core
        }
        dummyK.rotateX(Math.PI / 2);
        dummyK.rotateY(Math.PI / 4); // Diamond rotation
        dummyK.scale.set(1.5, 1.6, 0.6); // Much thicker armored plates
        dummyK.updateMatrix();
        carapaces.canonical.push(dummyK.matrix.clone());
      } else {
        // Brutalist Forearm Spine (12 trailing massive shards)
        const fIdx = localI - 4; 
        const t = fIdx / 11; 
        
        if (isLeft) {
          dummyK.position.lerpVectors(new THREE.Vector3(-40, 4, 0), new THREE.Vector3(-110, 40, -40), t);
          dummyK.lookAt(-110, 40, -40);
        } else {
          dummyK.position.lerpVectors(new THREE.Vector3(45, -8, 0), new THREE.Vector3(90, -40, -60), t);
          dummyK.lookAt(90, -40, -60);
        }
        
        dummyK.position.y += Math.sin(t * Math.PI) * 10; 
        
        dummyK.rotateX(Math.PI / 2);
        dummyK.rotateY(Math.PI / 4);
        
        const fScale = 2.0 - (t * 1.0); // Thick base, tapers off
        dummyK.scale.set(fScale * 1.2, fScale * 2.0, fScale * 0.8); // Beefy trailing shards
        dummyK.updateMatrix();
        carapaces.canonical.push(dummyK.matrix.clone());
      }
    }

    // 3. ARCHES (Shirt Hanger & Wrist Bracers)
    for (let i = 0; i < archCount; i++) {
      const angle = (i / archCount) * Math.PI * 2;
      const cRadius = 130 + Math.random() * 70;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 150, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 2 + 1);
      dummyC.updateMatrix();
      arches.chaotic.push(dummyC.matrix.clone());

      if (i < 16) {
        // Main Overhead Halo (Shirt Hanger)
        const t = i / 15; 
        const archAngle = t * Math.PI; 
        const archRadius = 80; // Tighter halo
        
        const ax = Math.cos(archAngle) * archRadius;
        const ay = 90 + Math.sin(archAngle) * (archRadius * 0.5); 
        const az = -20 - Math.sin(archAngle) * 15;

        dummyK.position.set(ax, ay, az);
        
        const tx = -Math.sin(archAngle);
        const ty = Math.cos(archAngle) * 0.7;
        const tz = -Math.cos(archAngle) * 0.2;
        const target = new THREE.Vector3(ax + tx, ay + ty, az + tz);
        
        dummyK.lookAt(target);
        dummyK.rotateX(Math.PI / 2);
        dummyK.scale.set(1.0, 2.0, 0.6); // Thicker imposing ribbon
        dummyK.updateMatrix();
        arches.canonical.push(dummyK.matrix.clone());
      } else {
        // Mechanical Wrist Bracers (8 per wrist)
        const wIdx = i - 16;
        const isLeftWrist = wIdx < 8;
        const wSign = isLeftWrist ? -1 : 1;
        const localW = isLeftWrist ? wIdx : (wIdx - 8); 
        
        const wAngle = (localW / 8) * Math.PI * 2;
        const wRadius = 16; // Wrap around thicker forearm
        const wCenter = new THREE.Vector3(wSign * 55, 25, -10);
        
        dummyK.position.set(
          wCenter.x + (Math.cos(wAngle) * wRadius * 0.2), 
          wCenter.y + Math.sin(wAngle) * wRadius, 
          wCenter.z + Math.cos(wAngle) * wRadius
        );
        
        dummyK.lookAt(wCenter);
        dummyK.scale.set(0.6, 1.2, 0.3); // Solid structural rings
        dummyK.updateMatrix();
        arches.canonical.push(dummyK.matrix.clone());
      }
    }

    // 4. JOINTS (Knuckles)
    for (let i = 0; i < jointCount; i++) {
      const angle = (i / jointCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      joints.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const localI = isLeft ? i : (i - 16);

      if (localI < 14) {
        const isThumb = localI >= 12;
        const fingerIdx = isThumb ? 4 : Math.floor(localI / 3);
        const jointIdx = isThumb ? (localI - 12) : (localI % 3);
        
        const rig = new THREE.Object3D();
        // Base knuckles positioned in an asymmetric reaching pose
        let fp, target, curl, jointScale;
        
        if (isLeft) {
          // Gold Arm - Reaching straight in
          const fpLeft = [
            [-30, 12, 5], [-30, 6, 5], [-30, 0, 5], [-30, -6, 5], [-25, 14, -2]
          ];
          const targetsLeft = [
            [0, 12, 5], [0, 6, 5], [0, 0, 5], [0, -6, 5], [-15, 20, 10]
          ];
          fp = fpLeft[fingerIdx];
          target = targetsLeft[fingerIdx];
          
          curl = 0.05; 
          jointScale = [1.0, 1.05, 0.95, 0.8, 1.2][fingerIdx];
        } else {
          // Dark Purple Arm - Cupping from underneath, fingers splayed wildly
          const fpRight = [
            [34, 4, -5], [35, 1, -2], [36, -2, 2], [37, -5, 8], [36, 4, -12]
          ];
          const targetsRight = [
            [10, 24, -5], 
            [10, 14, -2], 
            [10, 4, 5],   
            [10, -11, 15],
            [40, 14, -20] 
          ];
          fp = fpRight[fingerIdx];
          target = targetsRight[fingerIdx];
          
          curl = 0.15; 
          jointScale = [1.0, 1.05, 0.95, 0.8, 1.2][fingerIdx];
        }

        rig.position.set(fp[0], fp[1], fp[2]);
        rig.lookAt(target[0], target[1], target[2]);
        // Fix for fingers pointing backwards
        rig.rotateY(Math.PI);
        
        const curlDir = isLeft ? -1 : 1; 

        let currentJoint = rig;
        const jointLength = isThumb ? 16 : 24;

        for (let j = 0; j <= jointIdx; j++) {
          const nextJoint = new THREE.Object3D();
          if (j > 0) nextJoint.position.set(0, 0, -jointLength * jointScale);
          nextJoint.rotation.set(curl * curlDir, 0, 0); 
          currentJoint.add(nextJoint);
          currentJoint = nextJoint;
        }

        currentJoint.updateMatrixWorld(true);
        dummyK.matrix.copy(currentJoint.matrixWorld);
        
        const taper = 1 - (jointIdx * 0.2);
        // Heavy, defined diamond knuckles
        dummyK.matrix.multiply(new THREE.Matrix4().makeScale(0.8 * taper, 0.8 * taper, 0.8 * taper)); 
        joints.canonical.push(dummyK.matrix.clone());
      } else {
        dummyK.position.set(0, -100, 0);
        dummyK.scale.set(0, 0, 0);
        dummyK.updateMatrix();
        joints.canonical.push(dummyK.matrix.clone());
      }
    }

    return { carapaces, spikes, joints, arches };
  }, []);

  useFrame((_, delta) => {
    if (!carapaceRef.current || !archRef.current || !jointRef.current || !spikeRef.current) return;

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
      const progressArches = mapProgress(p, 0.0, 0.4);      // Arch sweeps in from the darkness
      const progressCarapaces = mapProgress(p, 0.2, 0.6);  // Forearms lock into place
      const progressJoints = mapProgress(p, 0.4, 0.85);   // Knuckles assemble
      const progressSpikes = mapProgress(p, 0.6, 1.0);     // Aggressive fingers close in

      interpolateInstances(archRef, transforms.arches, archCount, progressArches);
      interpolateInstances(carapaceRef, transforms.carapaces, carapaceCount, progressCarapaces);
      interpolateInstances(jointRef, transforms.joints, jointCount, progressJoints);
      interpolateInstances(spikeRef, transforms.spikes, spikeCount, progressSpikes);
    }
  });

  useEffect(() => {
    if (!carapaceRef.current || !archRef.current || !jointRef.current || !spikeRef.current) return;

    // 5. Instanced Color Variation (Depth-based Tonal Hierarchy)
    const applyDepthColor = (ref: React.RefObject<THREE.InstancedMesh>, count: number) => {
      if (!ref.current) return;
      const tempMatrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const cForeground = new THREE.Color('#202428'); // Subtle cool steel highlight
      const cMidground = new THREE.Color('#0b0e12');  // Deep obsidian/chitin
      const cBackground = new THREE.Color('#020304'); // Void black
      
      for (let i = 0; i < count; i++) {
        ref.current.getMatrixAt(i, tempMatrix);
        position.setFromMatrixPosition(tempMatrix);
        
        // Calculate distance from center (0,0,0)
        const dist = position.length();
        
        let color = cMidground;
        if (dist < 50) color = cForeground; // Closer objects are slightly brighter
        else if (dist > 90) color = cBackground; // Far objects fade into the void
        
        // Add tiny bit of random variation so no two blocks are perfectly identical (~2% lightness variance)
        const varColor = color.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.03);
        
        ref.current.setColorAt(i, varColor);
      }
      ref.current.instanceColor!.needsUpdate = true;
    };

    applyDepthColor(archRef, archCount);
    applyDepthColor(carapaceRef, carapaceCount);
    applyDepthColor(jointRef, jointCount);
    applyDepthColor(spikeRef, spikeCount);

  }, []);

  return (
    <group>
      {/* The Monolith (Initial Camera Occlusion for Intro Reveal - 0.75% scroll) */}
      {(!ancSolved || !networkSolved || !visionSolved || !logicSolved) && (
        <mesh position={[0, 0, 210]}>
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
      

      
      {/* The Instances (Replacing Boxes with Chitinous Geometries) */}
      <instancedMesh ref={carapaceRef} args={[undefined, undefined, carapaceCount]} castShadow receiveShadow>
        <cylinderGeometry args={CARAPACE_ARGS} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={spikeRef} args={[undefined, undefined, spikeCount]} castShadow receiveShadow>
        <coneGeometry args={SPIKE_ARGS} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={jointRef} args={[undefined, undefined, jointCount]} castShadow receiveShadow>
        <octahedronGeometry args={JOINT_ARGS} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={archRef} args={[undefined, undefined, archCount]} castShadow receiveShadow>
        <cylinderGeometry args={ARCH_ARGS} />
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
