import { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';
import { MotionValue } from 'framer-motion';
import { NetworkGraph } from './NetworkGraph';
import { ControlChamber } from './ControlChamber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { HUB_POSITIONS_3D, CORRUPTED_HUB } from '../../config/networkHubs';

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
      if (data[index] > 128) {
        validPoints.push([-(x - 128) / 10, -(y - 64) / 10]);
      }
    }
  }
  
  for (let i = 0; i < count; i++) {
    const pt = validPoints[i % validPoints.length];
    if (pt) {
      result[i*3] = pt[0] + (Math.random() - 0.5) * 0.3; // X
      result[i*3+1] = pt[1] + (Math.random() - 0.5) * 0.3; // Y
      result[i*3+2] = (Math.random() - 0.5) * 1.5; // Z depth jitter
    }
  }
  return result;
};

const generateHollowBlock = (text: string, count: number): Float32Array => {
  const result = new Float32Array(count * 3);
  
  // Create a canvas to get text pixels
  const W = 80;
  const H = 32;
  const D = 6;
  
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  
  const solidVoxels: [number, number, number][] = [];
  
  if (ctx) {
    ctx.fillStyle = 'white'; // Solid block
    ctx.fillRect(0, 0, W, H);
    
    ctx.fillStyle = 'black'; // Text to hollow out
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into two lines
    const lines = text.split('\n');
    ctx.fillText(lines[0], W/2, H/3 + 2);
    if (lines[1]) ctx.fillText(lines[1], W/2, (H/3)*2 + 2);
    
    const data = ctx.getImageData(0, 0, W, H).data;
    
    // Find all valid (solid) voxel coordinates
    for (let z = 0; z < D; z++) {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const index = (y * W + x) * 4;
          // If it's white (color > 128), it's solid. If black, it's text (hollow).
          if (data[index] > 128) {
            solidVoxels.push([x, y, z]);
          }
        }
      }
    }
  } else {
    // Fallback if no canvas
    solidVoxels.push([0, 0, 0]);
  }
  
  // Fill the result array with solid voxels, looping if necessary
  for (let i = 0; i < count; i++) {
    const v = solidVoxels[i % solidVoxels.length];
    const i3 = i * 3;
    // Scale and center the block
    result[i3] = -(v[0] - W/2) / 3; // INVERT X to fix mirroring
    result[i3+1] = -(v[1] - H/2) / 3; // INVERT Y
    result[i3+2] = (v[2] - D/2) / 3;
  }
  return result;
};

// Temporary utility to export the scene to Blender
const SceneExporter = () => {
  const { scene } = useThree();
  const [exported, setExported] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'E' && e.shiftKey) {
        setExported(true);
        setTimeout(() => setExported(false), 5000);
        
        console.log(
          "%c[CTRL-FREAK]%c AUTHORIZATION OVERRIDE ACCEPTED.\\n%cENVIRONMENT GEOMETRY EXFILTRATED SUCCESSFULLY.", 
          "color: #FF3333; font-weight: bold; font-size: 14px; background: black; padding: 2px 4px;",
          "color: white; font-weight: bold; font-size: 14px; background: black; padding: 2px 4px;",
          "color: #00FF00; font-weight: normal; font-size: 12px; background: black; padding: 2px 4px; display: block; margin-top: 4px;"
        );

        const exporter = new GLTFExporter();
        exporter.parse(
          scene,
          (gltf) => {
            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'control_chamber.gltf';
            link.click();
          },
          (error) => console.error('An error happened during export:', error),
          { binary: false } // Export as .gltf
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene]);

  if (!exported) return null;

  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none w-screen h-screen">
        <div className="text-[#FF3333] font-mono text-center animate-pulse bg-black/80 p-8 md:p-12 border border-[#FF3333] backdrop-blur-md">
          <div className="text-2xl md:text-4xl font-bold tracking-[0.2em] uppercase mb-4 font-sans">
            Easter Egg Unlocked
          </div>
          <div className="text-xs md:text-sm tracking-[0.3em] uppercase text-white">
            [SYS_OVERRIDE] Environment Data Exfiltrated
          </div>
        </div>
      </div>
    </Html>
  );
};

// A massive, glitching point cloud that evolves into specific formations based on scroll progress
const ParticleSystem = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const count = 12000; // Doubled count for massive density increase
  
  // Pre-calculate all target shapes
  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const wave = new Float32Array(count * 3);
    const network = new Float32Array(count * 3);
    const vision = new Float32Array(count * 3);
    const circuit = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);

    // Primary Hubs are globally defined as PRIMARY_HUBS

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

      // --- SHAPE 3 (NETWORK TOPOLOGY) — rewritten allocation ---
      const roll = i / count; // deterministic, not Math.random — stable across renders

      if (roll < 0.55) {
        // HUB MEMBERSHIP — 55% of all particles anchor to a primary hub.
        // Corrupted hub gets a 2x share and a bigger radius so it visually
        // dominates before the user does anything.
        const weights = [1, 1, 1, 2, 1];
        const totalW = weights.reduce((a, b) => a + b, 0);
        let r = (i * 2654435761 % 1000) / 1000 * totalW; // deterministic pseudo-random
        let hubIdx = 0;
        for (; hubIdx < weights.length; hubIdx++) {
          if (r < weights[hubIdx]) break;
          r -= weights[hubIdx];
        }
        const hub = HUB_POSITIONS_3D[hubIdx as keyof typeof HUB_POSITIONS_3D];
        const radius = hubIdx === CORRUPTED_HUB ? 3.2 : 1.8;
        // Volumetric filling instead of a hollow shell
        const rVol = radius * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        network[i3]     = hub[0] + rVol * Math.sin(phi) * Math.cos(theta);
        network[i3 + 1] = hub[1] + rVol * Math.sin(phi) * Math.sin(theta);
        network[i3 + 2] = hub[2] + rVol * Math.cos(phi);
      } else {
        // FLOW POOL — 45%, reserved for route-streaming in useFrame.
        // Idle default: loosely orbiting the corrupted hub (the "congestion").
        const hub = HUB_POSITIONS_3D[CORRUPTED_HUB as keyof typeof HUB_POSITIONS_3D];
        const rVol = (3 + Math.random() * 5) * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        network[i3]     = hub[0] + Math.cos(theta) * rVol;
        network[i3 + 1] = hub[1] + Math.sin(theta) * rVol * 0.6;
        network[i3 + 2] = hub[2] + (Math.random() - 0.5) * 4;
      }

      // 4. VISION (Anamorphic Shape)
      // Vision will be populated dynamically via useEffect
      vision[i3] = 0; vision[i3+1] = 0; vision[i3+2] = 0;

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

    return { sphere, wave, network, vision, circuit, ring };
  }, [count]);

  // ANAMORPHIC ILLUSION: Hollow Block Rotation
  const visionPitch = useCtrlFreakStore(s => s.vision.pitch);
  const visionYaw = useCtrlFreakStore(s => s.vision.yaw);
  
  // Base points remain static (Hollow Block)
  const baseVision = useMemo(() => generateHollowBlock('HR 98\nAA 0000', count), [count]);

  // Apply rotation natively inside useEffect to avoid thrashing useFrame
  useEffect(() => {
    const cosP = Math.cos(visionPitch);
    const sinP = Math.sin(visionPitch);
    const cosY = Math.cos(visionYaw);
    const sinY = Math.sin(visionYaw);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = baseVision[i3];
      const y = baseVision[i3 + 1];
      const z = baseVision[i3 + 2];

      // Pitch (Rotate X)
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;

      // Yaw (Rotate Y)
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      shapes.vision[i3] = x2;
      shapes.vision[i3 + 1] = y1;
      shapes.vision[i3 + 2] = z2;
    }
  }, [visionPitch, visionYaw, count, baseVision, shapes]);

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
      shape1 = shapes.network; shape2 = shapes.vision; lerpFactor = smoothstep(0.50, 0.55, progress);
    } else if (progress < 0.65) {
      shape1 = shapes.vision; shape2 = shapes.vision; lerpFactor = 0;
    } else if (progress < 0.70) {
      shape1 = shapes.vision; shape2 = shapes.circuit; lerpFactor = smoothstep(0.65, 0.70, progress);
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

      // --- useFrame network branch — rewritten flow gate ---
      if (shape1 === shapes.network || shape2 === shapes.network) {
        const netWeight = shape1 === shapes.network ? (1 - lerpFactor) : lerpFactor;
        if (netWeight > 0) {
          const networkState = useCtrlFreakStore.getState().network;
          const isFlowParticle = (i / count) >= 0.55; // matches the 55/45 split above

          if (isFlowParticle) {
            // Flow from SRC (0) to DST (1) via relays based on load.
            const p1 = HUB_POSITIONS_3D[0]; // SRC
            const p2 = HUB_POSITIONS_3D[1]; // DST
            
            // Choose a relay based on particle index
            const relayChoice = i % 3;
            let relayHubId: keyof typeof HUB_POSITIONS_3D = 2; // Frankfurt
            let load = networkState.frankfurt;
            if (relayChoice === 1) { relayHubId = 4; load = networkState.london; }
            if (relayChoice === 2) { relayHubId = 3; load = networkState.mumbai; }
            
            const relayPos = HUB_POSITIONS_3D[relayHubId];
            const isCorrupted = relayHubId === 3;
            
            // If load is 0, park the particle
            if (load > 0) {
              const flowSpeed = networkState.solved ? 2.0 : (isCorrupted && load > 40) ? 0.3 : 0.8;
              const tFlow = (t * flowSpeed + (i / count) * 6) % 1.0;
              
              // Two-part journey: SRC -> Relay, Relay -> DST
              let startP = p1, endP = relayPos;
              let localT = tFlow * 2;
              if (localT > 1) {
                startP = relayPos; endP = p2;
                localT -= 1;
              }
              
              const thickness = 0.4;
              const jitterMagnitude = (isCorrupted && load > 40 && !networkState.solved) ? 3.0 : thickness;
              const jitterX = (Math.random() - 0.5) * jitterMagnitude;
              const jitterY = (Math.random() - 0.5) * jitterMagnitude;
              const jitterZ = (Math.random() - 0.5) * jitterMagnitude;
  
              const bulge = Math.sin(localT * Math.PI) * 1.5; 
              
              x = (startP[0] + (endP[0] - startP[0]) * localT + jitterX) * netWeight + x * (1 - netWeight);
              y = (startP[1] + (endP[1] - startP[1]) * localT + jitterY) * netWeight + y * (1 - netWeight);
              z = (startP[2] + (endP[2] - startP[2]) * localT + jitterZ + bulge) * netWeight + z * (1 - netWeight);
            } else {
              // Park if load is 0
              x += (Math.random() - 0.5) * 0.1 * netWeight;
              y += (Math.random() - 0.5) * 0.1 * netWeight;
              z += (Math.random() - 0.5) * 0.1 * netWeight;
            }
          } else {
            // Ambient behavior
            const corruptedHub = HUB_POSITIONS_3D[CORRUPTED_HUB];
            const isCorruptedNeighborhood = Math.hypot(x - corruptedHub[0], y - corruptedHub[1], z - corruptedHub[2]) < 6;
            const pulse = isCorruptedNeighborhood ? (Math.sin(t * 3 + i) * 0.5 + 0.5) : 0.1;
            x += (Math.random() - 0.5) * pulse * netWeight;
            y += (Math.random() - 0.5) * pulse * netWeight;
            z += (Math.random() - 0.5) * pulse * netWeight;
          }
        }
      }
      
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
    
    // Removed idle wobble to keep the UI stations and alignment puzzles rock solid
    pointsRef.current.quaternion.copy(targetQuaternion);

    // --- COLOR LOGIC ---
    const material = pointsRef.current.material as THREE.PointsMaterial;
    if (timeState <= 0) {
      // Solid Emergency Red when counting up
      material.color.setRGB(1, 0, 0);
    } else {
      let r = Math.max(0.1, 1.0 - progress * 1.5);
      let g = Math.min(1.0, 0.2 + (progress * 1.2));
      let b = Math.min(1.0, 0.2 + (progress * 1.2));
      
      // If we're in the Logic section, highlight the boolean states
      if (progress > 0.65 && progress < 0.85) {
        const logicSolved = useCtrlFreakStore.getState().logic.solved;
        if (logicSolved) {
          r = 0.2; g = 1.0; b = 0.2; // Solid Green
        } else {
          r = 1.0; g = 0.2; b = 0.2; // Solid Red
        }
      }
      
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
      targetOffsetX = 6 * t; // Ends at +6
      targetScale = 0.6 + 0.3 * t;
    } else if (progress > 0.35 && progress <= 0.50) {
      // Station 02: UI Right, Core Left
      const t = smoothstep(0.35, 0.40, progress);
      targetOffsetX = 9 - 18 * t; // Ends at -9
      targetScale = 0.9;
    } else if (progress > 0.50 && progress <= 0.65) {
      // Station 03: UI Left, Core Right
      const t = smoothstep(0.50, 0.55, progress);
      targetOffsetX = -9 + 18 * t; // Ends at +9
      targetScale = 0.9;
    } else if (progress > 0.65 && progress <= 0.80) {
      // Station 04: UI Right, Core Left
      const t = smoothstep(0.65, 0.70, progress);
      targetOffsetX = 9 - 18 * t; // Ends at -9
      targetScale = 0.9;
    } else if (progress > 0.80 && progress <= 0.85) {
      // Return to Center
      const t = smoothstep(0.80, 0.85, progress);
      targetOffsetX = -9 * (1 - t);
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
        <SceneExporter />
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        
        {/* Phase 0: The Architectural Prototype */}
        <ControlChamber />
        
        {/* Phase 1: The Field (6,000 particles) */}
        <ParticleSystem scrollProgress={scrollProgress} />
        
        <NetworkGraph scrollProgress={scrollProgress} />

        {/* Phase 2: Camera Choreography */}
        <CameraRig scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
