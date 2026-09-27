import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

// Procedural Vocabulary Geometries (Sharp, Abstract, Chitinous)
// Carapace: Tapered 4-sided wedge (radiusTop, radiusBottom, height, radialSegments)
// Removed CARAPACE_ARGS
// Spike: Elongated 4-sided pyramid (radius, height, radialSegments)
// Removed SPIKE_ARGS
// Joint: Sharp octahedron/diamond (radius, detail)
const JOINT_ARGS: [number, number, number, number] = [2, 2, 1.5, 16];
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
  const carapaceCount = 256;
  const spikeCount = 128;
  const jointCount = 128;
  const archCount = 64;

  // React to solved states for lighting changes
  const ancSolved = useCtrlFreakStore(s => s.anc.solved);
  const networkSolved = useCtrlFreakStore(s => s.network.solved);
  const visionSolved = useCtrlFreakStore(s => s.vision.solved);
  const logicSolved = useCtrlFreakStore(s => s.logic.solved);

  // Keep track of current interpolated stability
  const currentStability = useRef(0);

  const transforms = useMemo(() => {
    const carapaces = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const spikes = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const joints = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const arches = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };

    const skeleton = new THREE.Object3D();
  
    const buildArm = (isLeft: boolean) => {
      const armRoot = new THREE.Object3D();
      skeleton.add(armRoot);

      // 1. Spacing: Hands are wide, slightly below core, slightly in front
      const pX = isLeft ? -30 : 30; 
      const pY = -5;
      const pZ = 10;
      
      const palm = new THREE.Object3D();
      palm.position.set(pX, pY, pZ);
      
      // 2. True Anatomical Cupping Orientation
      // We want the fingers (-Z) to aim ABOVE and BEHIND the core, so they can curl DOWN over it.
      // Target for fingers: (0, 15, -5)
      // Vector V = Target - Palm
      // Object3D.lookAt points the local +Z axis toward the target. 
      // Since the forearm is built along the local +Z axis (z = 0 to 45), we WANT +Z to point AWAY from the core!
      // This means -Z (the front of the palm) will point exactly AT the core!
      // Therefore, the original awayTarget logic was mathematically correct for the arm's construction!
      const targetX = 0;
      const targetY = 15;
      const targetZ = -5;
      const vX = targetX - pX;
      const vY = targetY - pY;
      const vZ = targetZ - pZ;
      
      const awayTarget = new THREE.Vector3(pX - vX, pY - vY, pZ - vZ);
      palm.lookAt(awayTarget);
      
      // Add a slight roll so palms face each other more
      palm.rotateZ(isLeft ? 0.3 : -0.3);
      
      armRoot.add(palm);

      // 3. Intricate, Massive Palm Structure (Stepped for edge stemming)
      // Front Plate: Thinner, exactly matches finger spread so they stem from the edges
      const palmPlate1 = new THREE.Object3D();
      palmPlate1.userData = { type: 'carapace', scale: new THREE.Vector3(1.8, 1.8, 0.2) };
      palm.add(palmPlate1);
      
      // Mid Block: The massive "sledgehammer" bulk, pushed slightly back so it doesn't swallow fingers
      const palmPlate2 = new THREE.Object3D();
      palmPlate2.position.set(0, 0, 3);
      palmPlate2.userData = { type: 'carapace', scale: new THREE.Vector3(3.2, 3.2, 0.8) };
      palm.add(palmPlate2);

      // Heel Block: Connects the bulk to the wrist smoothly
      const palmPlate3 = new THREE.Object3D();
      palmPlate3.position.set(0, 0, 6);
      palmPlate3.userData = { type: 'carapace', scale: new THREE.Vector3(2.0, 2.0, 0.6) };
      palm.add(palmPlate3);

      // 4. The Wrist
      const wrist = new THREE.Object3D();
      wrist.position.set(0, 0, 8); 
      palm.add(wrist);

      // 5. The Elaborate Forearm
      const elbow = new THREE.Object3D();
      elbow.position.set(0, 0, 45); 
      // Angle the elbow so the upper arm reaches into the void
      elbow.rotation.x = -0.3; 
      elbow.rotation.y = isLeft ? 0.4 : -0.4; 
      wrist.add(elbow);

      // Fill the forearm
      for(let i=0; i<8; i++) {
         const zPos = 2 + i * 5;
         const fShard = new THREE.Object3D();
         fShard.position.set((Math.random() - 0.5)*3, (Math.random() - 0.5)*3, zPos);
         fShard.rotation.z = (Math.random() - 0.5);
         const s = 1.0 + (i * 0.15); 
         fShard.userData = { type: 'carapace', scale: new THREE.Vector3(s*1.8, s*2.2, 1.5) };
         wrist.add(fShard);

         if (i % 2 === 0) {
            const fArch = new THREE.Object3D();
            fArch.position.set(0, 0, zPos);
            fArch.rotation.x = Math.PI/2;
            fArch.rotation.z = Math.random();
            fArch.userData = { type: 'arch', scale: new THREE.Vector3(s*1.6, s*1.6, 0.8) };
            wrist.add(fArch);
         }
      }

      // 6. The Upper Arm (Stretching deep into the void)
      for(let i=0; i<12; i++) {
         const zPos = i * 18; 
         const uShard = new THREE.Object3D();
         uShard.position.set((Math.random() - 0.5)*5, (Math.random() - 0.5)*5, zPos);
         uShard.rotation.z = Math.random() * Math.PI;
         uShard.rotation.x = (Math.random() - 0.5) * 0.2;
         
         const s = 2.5 + (i * 0.4); 
         uShard.userData = { type: 'carapace', scale: new THREE.Vector3(s*2.5, s*2.5, 3.5) };
         elbow.add(uShard);
      }

      // 7. The Fingers
      // Target based FK orientation
      // Targets are pushed in a wide 25-unit radius ring around the core (0, 15, -5) to force fingers to fan out
      const fingers = isLeft ? [
        { name: 'Thumb', offset: new THREE.Vector3(8, 0, 2),   target: [-5, -5, 5],   length: 6.5, joints: 3, curl: -0.5, scale: 1.6 },
        { name: 'Index', offset: new THREE.Vector3(5, 6, 0),   target: [-5, 35, 5],   length: 8,   joints: 3, curl: -0.6, scale: 1.2 },
        { name: 'Middle', offset: new THREE.Vector3(0, 8, -2), target: [-5, 40, -20], length: 9,   joints: 4, curl: -0.5, scale: 1.3 },
        { name: 'Ring', offset: new THREE.Vector3(-5, 6, 0),   target: [-5, 20, -30], length: 8,   joints: 3, curl: -0.6, scale: 1.1 },
        { name: 'Pinky', offset: new THREE.Vector3(-8, 2, 1),  target: [-5, 0, -20],  length: 6.5, joints: 3, curl: -0.5, scale: 0.9 },
      ] : [
        { name: 'Thumb', offset: new THREE.Vector3(-8, 0, 2),  target: [ 5, -5, 5],   length: 6.5, joints: 3, curl: -0.5, scale: 1.6 },
        { name: 'Index', offset: new THREE.Vector3(-5, 6, 0),  target: [ 5, 35, 5],   length: 8,   joints: 3, curl: -0.6, scale: 1.2 },
        { name: 'Middle', offset: new THREE.Vector3(0, 8, -2), target: [ 5, 40, -20], length: 9,   joints: 4, curl: -0.5, scale: 1.3 },
        { name: 'Ring', offset: new THREE.Vector3(5, 6, 0),    target: [ 5, 20, -30], length: 8,   joints: 3, curl: -0.6, scale: 1.1 },
        { name: 'Pinky', offset: new THREE.Vector3(8, 2, 1),   target: [ 5, 0, -20],  length: 6.5, joints: 3, curl: -0.5, scale: 0.9 },
      ];

      // Update palm matrix so we can do world-space calculations
      palm.updateMatrixWorld(true);

      fingers.forEach(fd => {
        const fRoot = new THREE.Object3D();
        fRoot.position.copy(fd.offset);
        palm.add(fRoot);

        // Calculate local endpoint of the curled finger
        const dummyRoot = new THREE.Object3D();
        let currentDummy = dummyRoot;
        for (let j = 0; j <= fd.joints; j++) {
          const dNode = new THREE.Object3D();
          if (j > 0) {
            dNode.position.set(0, 0, -fd.length);
            dNode.rotation.set(fd.curl, 0, 0);
          }
          currentDummy.add(dNode);
          currentDummy = dNode;
        }
        dummyRoot.updateMatrixWorld(true);
        const localTip = new THREE.Vector3();
        currentDummy.getWorldPosition(localTip);

        // Rotation needed to map the curled tip onto the local -Z axis
        const tipDir = localTip.clone().normalize();
        const qToZ = new THREE.Quaternion().setFromUnitVectors(tipDir, new THREE.Vector3(0, 0, -1));

        // Get fRoot's world position
        fRoot.updateMatrixWorld(true);
        const worldRootPos = new THREE.Vector3();
        fRoot.getWorldPosition(worldRootPos);

        // World target for the fingertip
        const worldTarget = new THREE.Vector3(...fd.target);

        // Up vector: point AWAY from the core to ensure curl wraps INWARD
        const corePos = new THREE.Vector3(0, 15, -5);
        const wUp = worldRootPos.clone().sub(corePos).normalize();

        // Create a dummy looker in world space
        const dummyLooker = new THREE.Object3D();
        dummyLooker.position.copy(worldRootPos);
        dummyLooker.up.copy(wUp);
        // Object3D.lookAt aligns the +Z axis with the target.
        // We want the finger tip (which is mapped to -Z) to point at the target.
        // So we must point the +Z axis AWAY from the target!
        const vDir = worldTarget.clone().sub(worldRootPos);
        const fAwayTarget = worldRootPos.clone().sub(vDir);
        dummyLooker.lookAt(fAwayTarget);

        // Final world quaternion: look at target, then apply the corrective qToZ
        const finalWorldQuat = dummyLooker.quaternion.multiply(qToZ);

        // Convert world quaternion back to palm's local space
        const palmInvQuat = palm.quaternion.clone().invert();
        fRoot.quaternion.copy(palmInvQuat.multiply(finalWorldQuat));

        // Build the actual visual joints
        let currentJoint = fRoot;
        for (let j = 0; j <= fd.joints; j++) {
          const jointNode = new THREE.Object3D();
          if (j > 0) {
            jointNode.position.set(0, 0, -fd.length);
            jointNode.rotation.set(fd.curl, 0, 0);
          }
          currentJoint.add(jointNode);
          
          // Knuckles become mechanical discs
          const knuckle = new THREE.Object3D();
          const kScale = fd.scale * (1.2 - (j * 0.2));
          // Rotate knuckle 90deg so the cylinder acts as a horizontal hinge
          knuckle.rotation.set(Math.PI / 2, 0, 0);
          knuckle.userData = { type: 'joint', scale: new THREE.Vector3(kScale, kScale, kScale) };
          jointNode.add(knuckle);

          if (j < fd.joints) {
            // Bones are now massive brutalist blocks (carapace) instead of thin spikes
            const bone = new THREE.Object3D();
            bone.position.set(0, 0, -fd.length / 2);
            
            // Goldilocks zone: not wire-thin, not claw-machine bricks.
            // Base bone is ~2.5 units thick (vs palm's ~25 units), tapering to sharp 0.8 tip.
            const taperFactor = 1 - (j * (0.7 / fd.joints));
            const targetThickness = 2.5 * fd.scale * taperFactor; 
            const thicknessScale = targetThickness / 4.0; // Divide by boxGeometry width
            
            const bLenScale = fd.length / 16.0; // Divide by boxGeometry length
            
            // Add a slight tilt to the bone to make it look sharp and diamond-cut
            bone.rotation.set(0, 0, Math.PI / 4);
            
            bone.userData = { type: 'carapace', scale: new THREE.Vector3(thicknessScale, thicknessScale, bLenScale) };
            
            jointNode.add(bone);
          }
          currentJoint = jointNode;
        }
      });
    };

        buildArm(true);
    buildArm(false);

    // Force global matrix calculation for the entire skeleton
    skeleton.updateMatrixWorld(true);

    // Traverse and extract generated matrices
    const pos = new THREE.Vector3();
    const rot = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    skeleton.traverse((node) => {
      if (node.userData && node.userData.type) {
        // 1. Store Canonical Matrix (Perfect Assembly)
        const canonicalMatrix = node.matrixWorld.clone();
        if (node.userData.scale) {
          canonicalMatrix.scale(node.userData.scale);
        }

        // 2. Generate Chaotic Matrix (Exploded Debris)
        // Extract exact position so we know where it belongs
        canonicalMatrix.decompose(pos, rot, scale);
        
        const chaoticMatrix = new THREE.Matrix4();
        
        // Explode outward away from core
        const explosionDir = pos.clone().normalize();
        // Add strong random scatter
        explosionDir.x += (Math.random() - 0.5) * 1.5;
        explosionDir.y += (Math.random() - 0.5) * 1.5;
        explosionDir.z += (Math.random() - 0.5) * 1.5;
        explosionDir.normalize();
        
        // Push pieces far out into space (100 to 250 units away)
        const explodeDist = 100 + Math.random() * 150;
        const cPos = pos.clone().add(explosionDir.multiplyScalar(explodeDist));
        
        // Wild random rotation for the broken state
        const cRot = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
        );

        // Recompose chaotic matrix keeping the SAME scale as the canonical piece
        chaoticMatrix.compose(cPos, cRot, scale);

        switch(node.userData.type) {
          case 'carapace': 
            carapaces.canonical.push(canonicalMatrix); 
            carapaces.chaotic.push(chaoticMatrix);
            break;
          case 'spike': 
            spikes.canonical.push(canonicalMatrix); 
            spikes.chaotic.push(chaoticMatrix);
            break;
          case 'joint': 
            joints.canonical.push(canonicalMatrix); 
            joints.chaotic.push(chaoticMatrix);
            break;
          case 'arch': 
            arches.canonical.push(canonicalMatrix); 
            arches.chaotic.push(chaoticMatrix);
            break;
        }
      }
    });

    // Pad arrays up to maximum instance counts to avoid InstancedMesh draw range warnings
    const padArray = (arr: THREE.Matrix4[], max: number) => {
      const dummy = new THREE.Matrix4().makeScale(0,0,0);
      while(arr.length < max) arr.push(dummy);
    };

    padArray(carapaces.canonical, carapaceCount);
    padArray(carapaces.chaotic, carapaceCount);
    padArray(spikes.canonical, spikeCount);
    padArray(spikes.chaotic, spikeCount);
    padArray(joints.canonical, jointCount);
    padArray(joints.chaotic, jointCount);
    padArray(arches.canonical, archCount);
    padArray(arches.chaotic, archCount);

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
        <boxGeometry args={[4, 4, 16]} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={spikeRef} args={[undefined, undefined, spikeCount]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 14, 4]} />
        <primitive object={brutalistMaterial} attach="material" />
      </instancedMesh>

      <instancedMesh ref={jointRef} args={[undefined, undefined, jointCount]} castShadow receiveShadow>
        <cylinderGeometry args={JOINT_ARGS} />
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
