import { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';
import { MotionValue } from 'framer-motion';
import { NetworkGraph } from './NetworkGraph';
import { ControlChamber } from './ControlChamber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { HUB_POSITIONS_3D } from '../../config/networkHubs';

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

      // --- SHAPE 3 (NETWORK GLOBE) ---
      // A hollow sphere representing global data routes
      if (i / count < 0.45) {
        // Ambient globe shell
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 4.0 + (Math.random() - 0.5) * 0.2; // Shell thickness
        network[i3]     = r * Math.sin(phi) * Math.cos(theta);
        network[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        network[i3 + 2] = r * Math.cos(phi);
      } else {
        // Flow pool (dynamically routed in useFrame)
        // Park them at origin initially
        network[i3] = 0; network[i3+1] = 0; network[i3+2] = 0;
      }

      // 4. VISION (Anamorphic Shape)
      // Vision will be populated dynamically via useEffect
      vision[i3] = 0; vision[i3+1] = 0; vision[i3+2] = 0;

      // 5. THE VAULT (Logic / Facility Lockdown)
      // A massive concentric cylinder mechanism. We will assign particles to 4 distinct rings.
      // We encode the ring ID into the radius so we can rotate them individually in useFrame.
      const ringIds = [1.2, 1.8, 2.4, 3.0];
      const ringChoice = Math.floor(Math.random() * 4);
      const ringR = ringIds[ringChoice] + (Math.random() - 0.5) * 0.15; // thickness
      const ringTheta = Math.random() * 2 * Math.PI;
      const ringY = (Math.random() - 0.5) * 4; // Height of cylinder

      circuit[i3] = ringR * Math.cos(ringTheta);
      circuit[i3 + 1] = ringY;
      circuit[i3 + 2] = ringR * Math.sin(ringTheta);

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

    // Define exact transition zones based on 8 equal h-screen sections (700vh scroll space)
    // Each section is 1/7th (0.1428) apart.
    // 0.000: Arrival (Sphere) -> Stable: 0.00 to 0.05
    // 0.142: Observe -> Transition zone: 0.05 to 0.24
    // 0.285: ANC (Wave) -> Stable: 0.24 to 0.33
    // 0.428: Network (Globe) -> Stable: 0.38 to 0.47
    // 0.571: Vision (Grid) -> Stable: 0.52 to 0.61
    // 0.714: Logic (Vault) -> Stable: 0.66 to 0.76
    // 0.857: Clock (Ring) -> Stable: 0.81 to 1.00

    let shape1 = shapes.sphere;
    let shape2 = shapes.sphere;
    let lerpFactor = 0;

    if (progress < 0.05) {
      shape1 = shapes.sphere; shape2 = shapes.sphere; lerpFactor = 0;
    } else if (progress < 0.24) {
      shape1 = shapes.sphere; shape2 = shapes.wave; lerpFactor = smoothstep(0.05, 0.24, progress);
    } else if (progress < 0.33) {
      shape1 = shapes.wave; shape2 = shapes.wave; lerpFactor = 0;
    } else if (progress < 0.38) {
      shape1 = shapes.wave; shape2 = shapes.network; lerpFactor = smoothstep(0.33, 0.38, progress);
    } else if (progress < 0.47) {
      shape1 = shapes.network; shape2 = shapes.network; lerpFactor = 0;
    } else if (progress < 0.52) {
      shape1 = shapes.network; shape2 = shapes.vision; lerpFactor = smoothstep(0.47, 0.52, progress);
    } else if (progress < 0.61) {
      shape1 = shapes.vision; shape2 = shapes.vision; lerpFactor = 0;
    } else if (progress < 0.66) {
      shape1 = shapes.vision; shape2 = shapes.circuit; lerpFactor = smoothstep(0.61, 0.66, progress);
    } else if (progress < 0.76) {
      shape1 = shapes.circuit; shape2 = shapes.circuit; lerpFactor = 0;
    } else if (progress < 0.81) {
      shape1 = shapes.circuit; shape2 = shapes.ring; lerpFactor = smoothstep(0.76, 0.81, progress);
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

      // --- useFrame network branch ---
      if (shape1 === shapes.network || shape2 === shapes.network) {
        const netWeight = shape1 === shapes.network ? (1 - lerpFactor) : lerpFactor;
        if (netWeight > 0) {
          const networkState = useCtrlFreakStore.getState().network;
          const isFlowParticle = (i / count) >= 0.45;

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
              
              const thickness = 0.15;
              const jitterMagnitude = (isCorrupted && load > 40 && !networkState.solved) ? 3.0 : thickness;
              const jitterX = (Math.random() - 0.5) * jitterMagnitude;
              const jitterY = (Math.random() - 0.5) * jitterMagnitude;
              const jitterZ = (Math.random() - 0.5) * jitterMagnitude;
  
              // Create an arc over the globe
              const bulge = Math.sin(localT * Math.PI) * 2.0; 
              
              x = (startP[0] + (endP[0] - startP[0]) * localT + jitterX) * netWeight + x * (1 - netWeight);
              y = (startP[1] + (endP[1] - startP[1]) * localT + jitterY + bulge) * netWeight + y * (1 - netWeight);
              z = (startP[2] + (endP[2] - startP[2]) * localT + jitterZ + bulge) * netWeight + z * (1 - netWeight);
            } else {
              // Park at origin
              x = x * (1 - netWeight);
              y = y * (1 - netWeight);
              z = z * (1 - netWeight);
            }
          } else {
            // Ambient globe shell rotation
            const globalRotY = t * 0.1;
            const cosRY = Math.cos(globalRotY);
            const sinRY = Math.sin(globalRotY);
            const nx = x * cosRY - z * sinRY;
            const nz = x * sinRY + z * cosRY;
            
            // Apply slight turbulence if unsolved
            const turbulence = networkState.solved ? 0 : (Math.random() - 0.5) * 0.05;
            
            x = (nx + turbulence) * netWeight + x * (1 - netWeight);
            y = (y + turbulence) * netWeight + y * (1 - netWeight);
            z = (nz + turbulence) * netWeight + z * (1 - netWeight);
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

      // VAULT ANIMATION (Logic)
      if (shape1 === shapes.circuit || shape2 === shapes.circuit) {
        const circuitWeight = shape1 === shapes.circuit ? (1 - lerpFactor) : lerpFactor;
        if (circuitWeight > 0) {
          const logicSolved = useCtrlFreakStore.getState().logic.solved;
          
          // Approximate ring identification from current radius
          const r = Math.sqrt(x*x + z*z);
          // Ring IDs were [1.2, 1.8, 2.4, 3.0]. Determine which ring this is closest to:
          let ringIndex = 0;
          if (r > 2.7) ringIndex = 3;
          else if (r > 2.1) ringIndex = 2;
          else if (r > 1.5) ringIndex = 1;

          // Different rings rotate at different speeds/directions
          const speeds = [0.5, -0.7, 0.4, -0.3];
          let ringRot = speeds[ringIndex] * t;

          // If solved, gracefully align them back to 0 rotation
          if (logicSolved) {
            // Wrap rotation to nearest multiple of 2PI, or just smoothstep to 0
            ringRot = 0; // Simple snap for now, or we can just let it sit at 0
          }

          const cosR = Math.cos(ringRot);
          const sinR = Math.sin(ringRot);
          const nx = x * cosR - z * sinR;
          const nz = x * sinR + z * cosR;

          x = nx * circuitWeight + x * (1 - circuitWeight);
          z = nz * circuitWeight + z * (1 - circuitWeight);
          
          // Glow or expand if solved
          if (logicSolved) {
             const pulse = Math.sin(t * 5 - ringIndex) * 0.1;
             x += (x / r) * pulse * circuitWeight;
             z += (z / r) * pulse * circuitWeight;
          }
        }
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
