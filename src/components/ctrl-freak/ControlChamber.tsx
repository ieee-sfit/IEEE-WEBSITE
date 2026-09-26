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
    const dummyC = new THREE.Object3D(); // Chaotic
    const dummyK = new THREE.Object3D(); // Canonical (Ordered)
    
    const carapaces = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const spikes = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const joints = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };
    const arches = { chaotic: [] as THREE.Matrix4[], canonical: [] as THREE.Matrix4[] };

    // 1. SPIKES (Fingers & Claws)
    for (let i = 0; i < spikeCount; i++) {
      const angle = (i / spikeCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      dummyC.scale.setScalar(Math.random() * 1.5 + 0.5); 
      dummyC.updateMatrix();
      spikes.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 16);
      
      if (localI < 12) {
        // 4 Fingers, 3 joints each
        const fingerIdx = Math.floor(localI / 3); 
        const jointIdx = localI % 3; 
        
        const rig = new THREE.Object3D();
        
        // Push wrists far apart to X=±45
        const fingerPositions = [
          [sign * 42, 2, 10],     
          [sign * 42, 34, 0],    
          [sign * 46, 22, 8],    
          [sign * 44, 10, -6],   
        ];
        
        const fp = fingerPositions[fingerIdx];
        rig.position.set(fp[0], fp[1], fp[2]);
        rig.lookAt(0, fp[1] * 0.6, 0); // Point toward a slightly higher center
        
        const fingerOrient = [
          { pitch: 0.6, yaw: sign * 0.1 },      
          { pitch: -0.5, yaw: sign * -0.05 },     
          { pitch: -0.1, yaw: sign * 0.05 },      
          { pitch: 0.4, yaw: sign * -0.05 },      
        ];
        
        rig.rotateX(fingerOrient[fingerIdx].pitch);
        rig.rotateY(fingerOrient[fingerIdx].yaw);

        let currentJoint = rig;
        const jointLength = 12;
        const curlAmounts = [0.3, 0.3, 0.25, 0.25]; // Gentle inward curve
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
        
        const taper = 1 - (jointIdx * 0.15);
        // Spikes rotate 45 deg so edges face outward (diamond profile)
        dummyK.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 4));
        // Elongate the spike
        dummyK.matrix.multiply(new THREE.Matrix4().makeScale(1.5 * taper, (jointLength / 14) * 1.5, 1.5 * taper));
        
        spikes.canonical.push(dummyK.matrix.clone());
      } else {
        // Hide unused particles in canonical state
        dummyK.position.set(0, -100, 0);
        dummyK.scale.set(0, 0, 0);
        dummyK.updateMatrix();
        spikes.canonical.push(dummyK.matrix.clone());
      }
    }

    // 2. CARAPACES (Layered Forearms)
    for (let i = 0; i < carapaceCount; i++) {
      const angle = (i / carapaceCount) * Math.PI * 2;
      const cRadius = 150 + Math.random() * 100;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 200, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 1.2 + 0.5);
      dummyC.updateMatrix();
      carapaces.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const sign = isLeft ? -1 : 1;
      const segmentIdx = isLeft ? i : (i - 16);
      
      if (segmentIdx < 6) {
        // 6 massive overlapping armor plates for the forearm
        const start = new THREE.Vector3(sign * 90, 110, -25); 
        const end = new THREE.Vector3(sign * 48, 18, 0); 
        
        const t = segmentIdx / 5; // 0 to 1
        
        // Curved trajectory for the arm
        const pMid = new THREE.Vector3(sign * 110, 60, -10);
        
        // Quadratic bezier
        const point = new THREE.Vector3();
        point.x = (1-t)*(1-t)*start.x + 2*(1-t)*t*pMid.x + t*t*end.x;
        point.y = (1-t)*(1-t)*start.y + 2*(1-t)*t*pMid.y + t*t*end.y;
        point.z = (1-t)*(1-t)*start.z + 2*(1-t)*t*pMid.z + t*t*end.z;

        // Next point for lookAt
        const t2 = Math.min(1, t + 0.1);
        const nextPoint = new THREE.Vector3();
        nextPoint.x = (1-t2)*(1-t2)*start.x + 2*(1-t2)*t2*pMid.x + t2*t2*end.x;
        nextPoint.y = (1-t2)*(1-t2)*start.y + 2*(1-t2)*t2*pMid.y + t2*t2*end.y;
        nextPoint.z = (1-t2)*(1-t2)*start.z + 2*(1-t2)*t2*pMid.z + t2*t2*end.z;

        dummyK.position.copy(point);
        dummyK.lookAt(nextPoint);
        
        // Rotate so flat side faces out
        dummyK.rotateX(Math.PI / 2);
        dummyK.rotateY(Math.PI / 4); // Diamond orientation
        
        // Plates get smaller toward the wrist
        const scale = 1.5 - (t * 0.8);
        dummyK.scale.set(scale * 1.5, scale * 1.2, scale * 2.5); // Wide and flat
        
        dummyK.updateMatrix();
        carapaces.canonical.push(dummyK.matrix.clone());
      } else {
        // Hide unused carapaces in canonical state
        dummyK.position.set(0, -100, 0);
        dummyK.scale.set(0, 0, 0);
        dummyK.updateMatrix();
        carapaces.canonical.push(dummyK.matrix.clone());
      }
    }

    // 3. ARCHES (The "Shirt Hanger" connecting the arms above)
    for (let i = 0; i < archCount; i++) {
      const angle = (i / archCount) * Math.PI * 2;
      const cRadius = 130 + Math.random() * 70;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 150, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 2 + 1);
      dummyC.updateMatrix();
      arches.chaotic.push(dummyC.matrix.clone());

      // Canonical: Build a massive arched halo structure connecting the two arms
      const t = i / (archCount - 1); // 0 to 1
      const archAngle = t * Math.PI; // Half circle
      
      const archRadius = 90;
      // Arch sits high up and slightly backward
      const ax = Math.cos(archAngle) * archRadius;
      const ay = 100 + Math.sin(archAngle) * (archRadius * 0.7); 
      const az = -30 - Math.sin(archAngle) * 20;

      dummyK.position.set(ax, ay, az);
      
      // Look along the tangent of the circle
      const tx = -Math.sin(archAngle);
      const ty = Math.cos(archAngle) * 0.7;
      const tz = -Math.cos(archAngle) * 0.2;
      
      const target = new THREE.Vector3(ax + tx, ay + ty, az + tz);
      dummyK.lookAt(target);
      dummyK.rotateX(Math.PI / 2);
      
      dummyK.scale.set(1.5, 1.5, 0.5); // Flat ribbon/halo
      
      dummyK.updateMatrix();
      arches.canonical.push(dummyK.matrix.clone());
    }

    // 4. JOINTS (Floating geometric nodes connecting segments)
    for (let i = 0; i < jointCount; i++) {
      const angle = (i / jointCount) * Math.PI * 2;
      const cRadius = 140 + Math.random() * 80;
      dummyC.position.set(Math.cos(angle) * cRadius, (Math.random() - 0.5) * 160, Math.sin(angle) * cRadius);
      dummyC.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2); 
      dummyC.scale.setScalar(Math.random() * 1.5 + 0.5);
      dummyC.updateMatrix();
      joints.chaotic.push(dummyC.matrix.clone());

      const isLeft = i < 16;
      const sign = isLeft ? -1 : 1;
      const localI = isLeft ? i : (i - 16);

      if (localI < 12) {
        // Place joints at the knuckles
        const fingerIdx = Math.floor(localI / 3);
        const jointIdx = localI % 3;
        
        const fingerPositions = [
          [sign * 42, 2, 10],     
          [sign * 42, 34, 0],    
          [sign * 46, 22, 8],    
          [sign * 44, 10, -6],   
        ];
        
        const rig = new THREE.Object3D();
        const fp = fingerPositions[fingerIdx];
        rig.position.set(fp[0], fp[1], fp[2]);
        rig.lookAt(0, fp[1] * 0.6, 0);

        let currentJoint = rig;
        const jointLength = 12;
        
        for (let j = 0; j <= jointIdx; j++) {
          const nextJoint = new THREE.Object3D();
          if (j > 0) nextJoint.position.set(0, jointLength, 0);
          nextJoint.rotation.set(0.25, 0, 0);
          currentJoint.add(nextJoint);
          currentJoint = nextJoint;
        }

        currentJoint.updateMatrixWorld(true);
        dummyK.matrix.copy(currentJoint.matrixWorld);
        
        const taper = 1 - (jointIdx * 0.15);
        dummyK.matrix.multiply(new THREE.Matrix4().makeScale(0.8 * taper, 0.8 * taper, 0.8 * taper)); 
        joints.canonical.push(dummyK.matrix.clone());
      } else {
        // Hide unused joints in canonical state
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
