import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { ControlChamber } from './ControlChamber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

const generateTextPoints = (text: string, count: number): Float32Array => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const result = new Float32Array(count * 3);
  if (!ctx) return result;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 80px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 64);
  
  const imageData = ctx.getImageData(0, 0, 256, 128);
  const data = imageData.data;
  
  const validPoints: [number, number][] = [];
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 256; x++) {
      const index = (y * 256 + x) * 4;
      if (data[index] > 128) { // If pixel is bright
        // Invert X because the billboarding orientation (lookAt) makes us look at the "back" of the XY plane
        validPoints.push([-(x - 128) / 10, -(y - 64) / 10]);
      }
    }
  }
  
  // Map particles to the valid pixels
  for (let i = 0; i < count; i++) {
    const pt = validPoints[i % validPoints.length];
    if (pt) {
      result[i*3] = pt[0] + (Math.random() - 0.5) * 0.3; // Slight jitter
      result[i*3+1] = pt[1] + (Math.random() - 0.5) * 0.3;
      result[i*3+2] = (Math.random() - 0.5) * 1.5; // Depth jitter
    }
  }
  return result;
};
// A massive, glitching point cloud that evolves into specific formations based on scroll progress
const ParticleSystem = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const count = 6000; // Increased count for better shape definition
  
  // Pre-calculate all target shapes
  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const wave = new Float32Array(count * 3);
    const network = new Float32Array(count * 3);
    const grid = new Float32Array(count * 3);
    const circuit = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);

    const nodes = [
      [-3, 2, 0], [3, 1.5, 0], [0, -2, 0], [-2, -1, 0], [2, -1.5, 0]
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 1. SPHERE (Arrival / Chaos)
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2 + Math.random() * 2;
      sphere[i3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i3 + 2] = r * Math.cos(phi);

      // 2. SINE WAVES (ANC - Base positions, animated in useFrame)
      const waveX = (i / count) * 20 - 10;
      let waveY = i % 2 === 0 ? 1.5 : -1.5;
      wave[i3] = waveX;
      wave[i3 + 1] = waveY;
      wave[i3 + 2] = 0;

      // 3. NETWORK TOPOLOGY
      if (Math.random() < 0.75) {
        // Cluster at nodes
        const node = nodes[i % nodes.length];
        network[i3] = node[0] + (Math.random() - 0.5) * 1.0;
        network[i3 + 1] = node[1] + (Math.random() - 0.5) * 1.0;
        network[i3 + 2] = node[2] + (Math.random() - 0.5) * 1.0;
      } else {
        // Lines between nodes
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const n2 = nodes[Math.floor(Math.random() * nodes.length)];
        const t = Math.random();
        network[i3] = n1[0] + (n2[0] - n1[0]) * t + (Math.random() - 0.5) * 0.1;
        network[i3 + 1] = n1[1] + (n2[1] - n1[1]) * t + (Math.random() - 0.5) * 0.1;
        network[i3 + 2] = n1[2] + (n2[2] - n1[2]) * t + (Math.random() - 0.5) * 0.1;
      }

      // 4. VOXEL GRID (Vision Binarization)
      const size3D = Math.ceil(Math.cbrt(count));
      const gX = i % size3D;
      const gY = Math.floor(i / size3D) % size3D;
      const gZ = Math.floor(i / (size3D * size3D));
      grid[i3] = (gX / size3D - 0.5) * 10;
      grid[i3 + 1] = (gY / size3D - 0.5) * 10;
      grid[i3 + 2] = (gZ / size3D - 0.5) * 10;

      // 5. DIRECTED SIGNAL FLOW (Logic / Facility Lockdown)
      // A vertical structure representing inputs, mechanical gates, and output.
      const branch = Math.floor(Math.random() * 3);
      const verticalPos = 6 - Math.random() * 12; // +6 to -6
      let hPos = 0;
      let depthPos = (Math.random() - 0.5) * 0.5;
      
      // Top section: 3 inputs
      if (verticalPos > 2) {
        hPos = (branch - 1) * 4; 
      } 
      // Middle section: converging into 2 parallel streams
      else if (verticalPos > -2) {
        hPos = branch === 0 ? -2 : 2;
      } 
      // Bottom section: converging to 1 output
      else {
        hPos = 0;
      }
      
      // Mechanical Diverters (Gates) at the intersections
      if (Math.abs(verticalPos - 2) < 0.8) {
        // Top Gates
        hPos = (branch === 0 ? -2 : 2) + (Math.random() - 0.5) * 2;
        depthPos = (Math.random() - 0.5) * 2;
      } else if (Math.abs(verticalPos + 2) < 0.8) {
        // Bottom Gate
        hPos = (Math.random() - 0.5) * 2;
        depthPos = (Math.random() - 0.5) * 2;
      } else {
        hPos += (Math.random() - 0.5) * 0.5;
      }
      
      circuit[i3] = hPos;
      circuit[i3 + 1] = verticalPos;
      circuit[i3 + 2] = depthPos;

      // 6. RING (The Clock / 12:00)
      const angle = Math.random() * Math.PI * 2;
      const ringRadius = 4.5 + (Math.random() - 0.5) * 1.5;
      ring[i3] = Math.cos(angle) * ringRadius;
      ring[i3 + 1] = Math.sin(angle) * ringRadius;
      ring[i3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    return { sphere, wave, network, grid, circuit, ring };
  }, [count]);

  // Initial render buffer
  const [positions] = useState(() => new Float32Array(count * 3));

  // --- THE CLOCK ---
  // Starts at 720 (12 minutes). When it hits 0, it goes negative, which we use to count upwards in red.
  const [timeState, setTimeState] = useState(720); 

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeState((t) => {
        if (t > -720) return t - 1; // Count down to 0, then count up to -720
        return t;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const absTime = Math.abs(timeState);
    const min = Math.floor(absTime / 60);
    const sec = (absTime % 60).toString().padStart(2, '0');
    const text = `${min.toString().padStart(2, '0')}:${sec}`;
    const newRing = generateTextPoints(text, count);
    
    // Mutate the ring buffer directly so useFrame picks it up without reallocation
    for (let i = 0; i < count * 3; i++) {
      shapes.ring[i] = newRing[i];
    }
  }, [timeState, shapes, count]);

  // Helper function to smoothstep interpolation
  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const progress = scrollProgress.get();
    const t = state.clock.getElapsedTime();
    const posAttribute = pointsRef.current.geometry.attributes.position;
    const posArray = posAttribute.array as Float32Array;

    // Define transition zones based on the 8 sections (approx 12.5% each)
    // 0.00 - 0.20: Sphere (Arrival)
    // 0.20 - 0.25: Transition -> Wave
    // 0.25 - 0.35: Wave (ANC)
    // 0.35 - 0.40: Transition -> Network
    // 0.40 - 0.50: Network (Network Saturation)
    // 0.50 - 0.55: Transition -> Grid
    // 0.55 - 0.65: Grid (Vision)
    // 0.65 - 0.70: Transition -> Circuit
    // 0.70 - 0.80: Circuit (Logic)
    // 0.80 - 0.85: Transition -> Ring
    // 0.85 - 1.00: Ring (Clock)

    let shape1 = shapes.sphere;
    let shape2 = shapes.sphere;
    let lerpFactor = 0;

    if (progress < 0.20) {
      shape1 = shapes.sphere; shape2 = shapes.sphere; lerpFactor = 0;
    } else if (progress < 0.25) {
      shape1 = shapes.sphere; shape2 = shapes.wave; lerpFactor = smoothstep(0.20, 0.25, progress);
    } else if (progress < 0.35) {
      shape1 = shapes.wave; shape2 = shapes.wave; lerpFactor = 0;
    } else if (progress < 0.40) {
      shape1 = shapes.wave; shape2 = shapes.network; lerpFactor = smoothstep(0.35, 0.40, progress);
    } else if (progress < 0.50) {
      shape1 = shapes.network; shape2 = shapes.network; lerpFactor = 0;
    } else if (progress < 0.55) {
      shape1 = shapes.network; shape2 = shapes.grid; lerpFactor = smoothstep(0.50, 0.55, progress);
    } else if (progress < 0.65) {
      shape1 = shapes.grid; shape2 = shapes.grid; lerpFactor = 0;
    } else if (progress < 0.70) {
      shape1 = shapes.grid; shape2 = shapes.circuit; lerpFactor = smoothstep(0.65, 0.70, progress);
    } else if (progress < 0.80) {
      shape1 = shapes.circuit; shape2 = shapes.circuit; lerpFactor = 0;
    } else if (progress < 0.85) {
      shape1 = shapes.circuit; shape2 = shapes.ring; lerpFactor = smoothstep(0.80, 0.85, progress);
    } else {
      shape1 = shapes.ring; shape2 = shapes.ring; lerpFactor = 0;
    }

    // Color logic moved to the bottom of the loop
    // Apply the morphing and specific shape animations
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Base morph interpolation
      let x = shape1[i3] + (shape2[i3] - shape1[i3]) * lerpFactor;
      let y = shape1[i3 + 1] + (shape2[i3 + 1] - shape1[i3 + 1]) * lerpFactor;
      let z = shape1[i3 + 2] + (shape2[i3 + 2] - shape1[i3 + 2]) * lerpFactor;

      // Add specific shape animations based on which shape we are currently at
      
      // SINE WAVE ANIMATION (Active when shape1 or shape2 is wave)
      if (shape1 === shapes.wave || shape2 === shapes.wave) {
        // Calculate how much "sine" behavior to apply
        const sineWeight = shape1 === shapes.wave ? (1 - lerpFactor) : lerpFactor;
        if (sineWeight > 0) {
          const isTop = i % 2 === 0;
          // 4A/5A: Read the latest state straight from the store without causing re-renders
          const ancPhase = useCtrlFreakStore.getState().anc.phase;
          const targetPhaseOffset = (Math.PI / 180) * (ancPhase - 180);
          const errorMagnitude = Math.min(1, Math.abs(ancPhase - 180) / 180);
          
          const currentPhaseOffset = isTop ? 0 : targetPhaseOffset;
          
          // 5B: Physical Response (Amplitude Instability & Turbulence)
          const amplitudeJitter = (Math.random() - 0.5) * errorMagnitude * 2.0;
          const amplitude = 2.0 + amplitudeJitter;
          
          const scatterX = (Math.random() - 0.5) * errorMagnitude * 0.5;
          const scatterY = (Math.random() - 0.5) * errorMagnitude * 0.5;
          const scatterZ = (Math.random() - 0.5) * errorMagnitude * 1.5;

          x += scatterX * sineWeight;
          y += (Math.sin(x * 1.5 + t * 2 + currentPhaseOffset) * amplitude + scatterY) * sineWeight;
          z += (Math.sin(x * 2 + t) * 1.5 + scatterZ) * sineWeight;
        }
      }

      // SPHERE JITTER (Arrival)
      if (shape1 === shapes.sphere && progress < 0.25) {
        const chaos = Math.max(0, 1 - (progress * 4));
        const glitch = chaos > 0.1 && Math.random() > 0.95 ? 1.2 : 1;
        x *= glitch; y *= glitch; z *= glitch;
      }

      // 720 COUNTDOWN (Clock)
      // Kept completely static for that monolithic, unyielding digital feel.
      // (No pulse or rotation applied)

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }
    
    posAttribute.needsUpdate = true;
    
    // --- ORIENTATION FIX ---
    // Make the Core explicitly face the camera so shapes (like sine wave and clock) 
    // are perfectly legible regardless of where the camera flies in the room.
    const targetMatrix = new THREE.Matrix4().lookAt(
      pointsRef.current.position,
      state.camera.position,
      new THREE.Vector3(0, 1, 0)
    );
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(targetMatrix);
    
    // Add a slight wobble for life
    const wobble = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(Math.cos(t * 0.1) * 0.05, Math.sin(t * 0.2) * 0.1, 0)
    );
    targetQuaternion.multiply(wobble);
    
    pointsRef.current.quaternion.copy(targetQuaternion);

    // --- COLOR LOGIC ---
    const material = pointsRef.current.material as THREE.PointsMaterial;
    if (timeState <= 0) {
      // Solid Emergency Red when counting up
      material.color.setRGB(1, 0, 0);
    } else {
      const r = Math.max(0.1, 1.0 - progress * 1.5);
      const g = Math.min(1.0, 0.2 + (progress * 1.2));
      const b = Math.min(1.0, 0.2 + (progress * 1.2));
      material.color.setRGB(r, g, b);
    }

    // --- CORE PLACEMENT HACK ---
    // Dynamically shift the Core's position relative to the camera's right vector
    // so it always occupies the empty side of the screen (UI is alternating Left/Right).
    // Also upscale the core proportionally while it's in the station views.
    let targetOffsetX = 0; 
    let targetScale = 0.6;
    
    if (progress > 0.20 && progress <= 0.35) {
      // Station 01: UI Left, Core Right
      const t = smoothstep(0.20, 0.25, progress);
      targetOffsetX = 6 * t; 
      targetScale = 0.6 + 0.3 * t;
    } else if (progress > 0.35 && progress <= 0.50) {
      // Station 02: UI Right, Core Left
      const t = smoothstep(0.35, 0.40, progress);
      targetOffsetX = 6 - 12 * t;
      targetScale = 0.9;
    } else if (progress > 0.50 && progress <= 0.65) {
      // Station 03: UI Left, Core Right
      const t = smoothstep(0.50, 0.55, progress);
      targetOffsetX = -6 + 12 * t;
      targetScale = 0.9;
    } else if (progress > 0.65 && progress <= 0.80) {
      // Station 04: UI Right, Core Left
      const t = smoothstep(0.65, 0.70, progress);
      targetOffsetX = 6 - 12 * t;
      targetScale = 0.9;
    } else if (progress > 0.80 && progress <= 0.85) {
      // Return to Center
      const t = smoothstep(0.80, 0.85, progress);
      targetOffsetX = -6 * (1 - t);
      targetScale = 0.9 - 0.3 * t;
    }

    const rightVec = new THREE.Vector3(1, 0, 0).applyQuaternion(state.camera.quaternion);
    const targetPos = new THREE.Vector3(0, 0, 0).add(rightVec.multiplyScalar(targetOffsetX));
    
    pointsRef.current.position.lerp(targetPos, 0.05);
    pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false} scale={0.6}>
      <PointMaterial
        transparent
        color="#ff3333"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const CameraRig = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  // A cinematic spline path for the camera to fly through the brutalist chamber
  const cameraPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 50, 80),    // 0.0: Arrival High (looking down at the core)
      new THREE.Vector3(0, 0, 22),     // 0.2: Core Center (incident detected)
      new THREE.Vector3(-25, -10, 15), // 0.35: Station 1 (Left Low, ANC)
      new THREE.Vector3(25, -15, 20),  // 0.5: Station 2 (Right Lower, Network)
      new THREE.Vector3(30, 20, -5),   // 0.65: Station 3 (Right High, behind the core, Vision)
      new THREE.Vector3(-20, 15, -20), // 0.8: Station 4 (Back Left High, Logic)
      new THREE.Vector3(0, 0, 22),     // 1.0: Final Clock (Front Center)
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    // We smooth the raw scroll progress so the camera feels weighty and doesn't stop instantly
    const progress = scrollProgress.get();
    
    // Get the exact point on the curve for this scroll percentage
    const targetPosition = cameraPath.getPoint(progress);
    
    // Smoothly lerp the camera towards the target position
    state.camera.position.lerp(targetPosition, 0.05);
    
    // Always keep the camera focused on the System Core at the center of the room
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

export const SystemCore = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 50, 80], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        
        {/* Phase 0: The Architectural Prototype */}
        <ControlChamber />
        
        {/* Phase 1: The Field (6,000 particles) */}
        <ParticleSystem scrollProgress={scrollProgress} />

        {/* Phase 2: Camera Choreography */}
        <CameraRig scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
