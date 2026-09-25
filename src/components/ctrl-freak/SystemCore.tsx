import { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';
import { MotionValue } from 'framer-motion';
import { ControlChamber } from './ControlChamber';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

const AmbientDust = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400; // Sparse field of dust
  
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 250; // X spread
      arr[i * 3 + 1] = -40 + Math.random() * 120; // Y spread (mostly lower/mid room)
      arr[i * 3 + 2] = (Math.random() - 0.5) * 250; // Z spread
    }
    return arr;
  }, []);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });
  
  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#ffffff" 
        size={0.25} 
        sizeAttenuation={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
        opacity={0.3} 
      />
    </Points>
  );
};

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

const generateDishPoints = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 160; canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if(!ctx) return [[0,0,0]];
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(80, 50, 55, 22, 0, Math.PI, Math.PI * 2); // dish bowl arc
  ctx.moveTo(80, 50); ctx.lineTo(80, 100); // support pole
  ctx.moveTo(80, 30); ctx.lineTo(80, 10); // receiver arm
  ctx.stroke();
  const data = ctx.getImageData(0, 0, 160, 120).data;
  const pts = [];
  for (let y = 0; y < 120; y++) {
    for (let x = 0; x < 160; x++) {
      if (data[(y * 160 + x) * 4] > 128) {
        pts.push([(x - 80) / 10, -(y - 60) / 10, (Math.random() - 0.5) * 0.6]);
      }
    }
  }
  return pts.length ? pts : [[0,0,0]];
};

const generatePadlockPoints = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 160; canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if(!ctx) return [[0,0,0]];
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  
  // Padlock body (square)
  ctx.strokeRect(50, 80, 60, 50);
  
  // Padlock open shackle (arch)
  ctx.beginPath();
  ctx.arc(80, 70, 20, Math.PI, 0); // left to right arch
  ctx.lineTo(100, 80); // down into body on right side
  // left side stays open
  ctx.stroke();

  // Keyhole
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(80, 100, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(78, 100, 4, 10);

  const data = ctx.getImageData(0, 0, 160, 160).data;
  const pts = [];
  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 160; x++) {
      // Check alpha or color
      if (data[(y * 160 + x) * 4 + 3] > 128) {
        pts.push([(x - 80) / 10, -(y - 80) / 10, (Math.random() - 0.5) * 0.4]);
      }
    }
  }
  return pts.length ? pts : [[0,0,0]];
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
  const count = 8000; // Restored to 8k for maximum visual density
  
  // Pre-calculate all target shapes
  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const wave = new Float32Array(count * 3);
    const network = new Float32Array(count * 3);
    const vision = new Float32Array(count * 3);
    const circuit = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);
    
    const dishOutlinePoints = generateDishPoints();
    const padlockOpenPoints = generatePadlockPoints();

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

      // --- SHAPE 3 (NETWORK) Fiber-Optic Bridges ---
      // 3 parallel data streams running horizontally (Source -> Stream)
      const bridgeIdx = Math.floor(i / (count / 3));
      const bridgeY = bridgeIdx === 0 ? 5 : bridgeIdx === 1 ? 0 : -5;
      
      const p = Math.random();
      const bx = -12 + p * 24; // Span from x=-12 to x=12
      
      const crossAngle = Math.random() * Math.PI * 2;
      const crossRadius = Math.random() * 0.4;
      
      const by = bridgeY + Math.cos(crossAngle) * crossRadius;
      const bz = Math.sin(crossAngle) * crossRadius;
      
      network[i3]     = bx;
      network[i3 + 1] = by;
      network[i3 + 2] = bz;

      // 4. VISION (Anamorphic Shape)
      vision[i3] = 0; vision[i3+1] = 0; vision[i3+2] = 0;

      // 5. THE VAULT (Logic) -> Vault Cryptex Tumblers
      // A massive cylindrical lock mechanism with 3 depth rings
      const vaultType = Math.floor((i / count) * 3); // 0: Outer, 1: Gate1, 2: Gate2
      const vTheta = Math.random() * 2 * Math.PI;
      // Introduce geometric "teeth" to the radius
      const teeth = (Math.sin(vTheta * 12) > 0.5 ? 0.3 : 0);
      
      let vR = 0;
      let vZ = 0;
      if (vaultType === 0) {
        // Outer static housing
        vR = 6.0 + Math.random() * 1.0 + teeth;
        vZ = -3.0 + Math.random() * 2.0;
      } else if (vaultType === 1) {
        // Middle tumbler (Gate 1)
        vR = 4.5 + Math.random() * 1.0 + teeth;
        vZ = -0.5 + Math.random() * 2.0;
      } else {
        // Inner tumbler (Gate 2)
        vR = 3.0 + Math.random() * 1.0 + teeth;
        vZ = 2.0 + Math.random() * 2.0;
      }
      
      circuit[i3]     = Math.cos(vTheta) * vR;
      circuit[i3 + 1] = Math.sin(vTheta) * vR;
      circuit[i3 + 2] = vZ;

      // 6. RING (The Clock / 12:00)
      const angle = Math.random() * Math.PI * 2;
      const ringRadius = 4.5 + (Math.random() - 0.5) * 1.5;
      ring[i3] = Math.cos(angle) * ringRadius;
      ring[i3 + 1] = Math.sin(angle) * ringRadius;
      ring[i3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    return { sphere, wave, network, vision, circuit, ring, dishOutlinePoints, padlockOpenPoints };
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

  // Initial render buffer (useMemo instead of useState so it updates when count changes)
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

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
          const net = useCtrlFreakStore.getState().network;
          
          const applyNetworkMods = (idx: number) => {
            const bridgeIdx = Math.floor(idx / (count / 3));
            const load = bridgeIdx === 0 ? net.frankfurt : bridgeIdx === 1 ? net.london : net.mumbai;
            
            const bridgeY = bridgeIdx === 0 ? 5 : bridgeIdx === 1 ? 0 : -5;
            
            // Determine critical threshold based on relay and resolution
            let criticalLimit = 100;
            if (bridgeIdx === 0) criticalLimit = 85; // Frankfurt
            else if (bridgeIdx === 1) criticalLimit = 70; // London
            else if (bridgeIdx === 2) criticalLimit = net.resolution === '4K' ? 15 : 40; // Mumbai
            
            // Stable seed for this particle
            const seed = Math.abs(Math.sin(idx * 12.9898 + 78.233));
            
            // Flow speed based on load
            const speed = net.solved ? 2.0 : (0.2 + (load / 100) * 1.5);
            
            // Calculate flow progress (-12 to 12)
            const rawP = (seed + (t * speed * 0.5)) % 1.0;
            let bx = -12 + rawP * 24;
            
            // Warning Pulse (within 10% of critical limit, but not over it)
            let pulse = 1.0;
            const isWarning = !net.solved && load >= criticalLimit - 10 && load <= criticalLimit;
            if (isWarning) {
               pulse = 1.0 + Math.abs(Math.sin(t * 15)) * 0.4; 
            }
            
            // Base thickness with geometric throbbing when in warning state
            const baseThick = net.solved ? 0.05 : (0.02 + Math.min(load, criticalLimit) / 100 * 0.3) * pulse;
            
            const crossAngle = Math.abs(Math.sin(idx * 43.111)) * Math.PI * 2;
            const dist = Math.abs(Math.sin(idx * 99.999));
            
            let by = bridgeY + Math.cos(crossAngle) * baseThick * dist;
            let bz = Math.sin(crossAngle) * baseThick * dist;
            
            // Critical Overload (Packet Loss): the pipe ruptures and particles fall heavily
            if (!net.solved && load > criticalLimit) {
              const overloadAmount = load - criticalLimit; // How far past the limit
              const ruptureFactor = overloadAmount / (100 - criticalLimit + 1); // 0 to 1 scaling
              
              // If highly overloaded, drop a percentage of particles as packets
              // Max 60% of particles drop when fully overloaded
              if (Math.abs(Math.sin(idx * 11.111)) < ruptureFactor * 0.6) {
                 // Fast, deep parabolic spark fall
                 const fallTime = (t * 4 + seed * 10) % 3; // 0 to 3 seconds of falling
                 by -= (fallTime * fallTime * 3); // Gravity curve pulling it way down
                 bx += (Math.cos(idx) * fallTime * 3); // Scatter widely horizontally
              }
            }
            
            // Underload (<15): Data barely makes it across, breaks into dotted lines
            if (!net.solved && load < 15) {
               // Create solid dashes of data with completely empty spaces between them
               if (Math.abs(Math.sin(idx * 0.5 + t * 4)) > 0.4) {
                  bx *= 0.01; by *= 0.01; bz *= 0.01; // Hide particles entirely
               }
            }
            
            return [bx, by, bz];
          };

          if (shape1 === shapes.network) {
            const [nx, ny, nz] = applyNetworkMods(i);
            x = nx * (1 - lerpFactor) + shape2[i3] * lerpFactor;
            y = ny * (1 - lerpFactor) + shape2[i3+1] * lerpFactor;
            z = nz * (1 - lerpFactor) + shape2[i3+2] * lerpFactor;
          } else if (shape2 === shapes.network) {
            const [nx, ny, nz] = applyNetworkMods(i);
            x = shape1[i3] * (1 - lerpFactor) + nx * lerpFactor;
            y = shape1[i3+1] * (1 - lerpFactor) + ny * lerpFactor;
            z = shape1[i3+2] * (1 - lerpFactor) + nz * lerpFactor;
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
          const logic = useCtrlFreakStore.getState().logic;
          
          const applyCircuitMods = (idx: number) => {
            const vaultType = Math.floor((idx / count) * 3);
            const vTheta = Math.abs(Math.sin(idx * 12.9898)) * Math.PI * 2;
            const teeth = (Math.sin(vTheta * 12) > 0.5 ? 0.3 : 0);
            
            let vR = 0;
            let vZ = 0;
            
            if (vaultType === 0) {
              // Outer static housing
              vR = 6.0 + Math.abs(Math.sin(idx * 78.233)) * 1.0 + teeth;
              vZ = -3.0 + Math.abs(Math.sin(idx * 43.111)) * 2.0;
            } else if (vaultType === 1) {
              // Middle tumbler (Gate 1)
              vR = 4.5 + Math.abs(Math.sin(idx * 78.233)) * 1.0 + teeth;
              vZ = -0.5 + Math.abs(Math.sin(idx * 43.111)) * 2.0;
            } else {
              // Inner tumbler (Gate 2)
              vR = 3.0 + Math.abs(Math.sin(idx * 78.233)) * 1.0 + teeth;
              vZ = 2.0 + Math.abs(Math.sin(idx * 43.111)) * 2.0;
            }
            
            let rotOffset = 0;
            let zOffset = 0;
            
            // ANIMATION LOGIC
            if (logic.solved) {
              // When solved, the entire unified cylinder rotates slowly and majestically
              rotOffset = t * 0.2;
              if (vaultType === 0) zOffset = -6.0; // Outer shell moves back
              if (vaultType === 1) zOffset = -3.0; // Gate 1 moves back
              if (vaultType === 2) zOffset = 3.0;  // Gate 2 moves forward
            } else {
              // Not fully solved
              if (vaultType === 1) {
                if (logic.slot1Correct) {
                  rotOffset = 0; // locked perfectly
                } else if (logic.slot1 !== null) {
                  // Wrong gate: violently jamming
                  rotOffset = (t * 0.5) + (Math.sin(t * 30) * 0.05); 
                  vR += (Math.abs(Math.sin(idx * 12.9898 + t)) - 0.5) * 0.3; // slight radius jitter from grinding
                } else {
                  // No gate: searching
                  rotOffset = t * 0.8;
                }
              }
              
              if (vaultType === 2) {
                if (logic.slot2Correct) {
                  rotOffset = 0; // locked perfectly
                } else if (logic.slot2 !== null) {
                  // Wrong gate: violently jamming
                  rotOffset = -(t * 0.6) + (Math.sin(t * 35) * 0.05); 
                  vR += (Math.abs(Math.sin(idx * 78.233 + t)) - 0.5) * 0.3;
                } else {
                  // No gate: searching in opposite direction
                  rotOffset = -t * 0.7;
                }
              }
            }
            
            const finalTheta = vTheta + rotOffset;
            const nx = Math.cos(finalTheta) * vR;
            const ny = Math.sin(finalTheta) * vR;
            const nz = vZ + zOffset;
            
            return [nx, ny, nz];
          };

          if (shape1 === shapes.circuit) {
            const [nx, ny, nz] = applyCircuitMods(i);
            x = nx * (1 - lerpFactor) + shape2[i3] * lerpFactor;
            y = ny * (1 - lerpFactor) + shape2[i3+1] * lerpFactor;
            z = nz * (1 - lerpFactor) + shape2[i3+2] * lerpFactor;
          } else if (shape2 === shapes.circuit) {
            const [nx, ny, nz] = applyCircuitMods(i);
            x = shape1[i3] * (1 - lerpFactor) + nx * lerpFactor;
            y = shape1[i3+1] * (1 - lerpFactor) + ny * lerpFactor;
            z = shape1[i3+2] * (1 - lerpFactor) + nz * lerpFactor;
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
        size={0.06}
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
      new THREE.Vector3(0, 80, 160),   // 0.0: Arrival High
      new THREE.Vector3(0, 0, 30),     // 0.2: Core Center
      new THREE.Vector3(-35, -5, 25),  // 0.35: Station 1 (Left Low)
      new THREE.Vector3(35, -5, 20),   // 0.5: Station 2 (Right Lower)
      new THREE.Vector3(30, 25, -20),  // 0.65: Station 3 (Right High)
      new THREE.Vector3(-20, 15, -20), // 0.8: Station 4 (Back Left High)
      new THREE.Vector3(0, 0, 35),     // 1.0: Final Clock (Straight ahead, eye-level with the massive hands)
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    // We smooth the raw scroll progress so the camera feels weighty and doesn't stop instantly
    const progress = scrollProgress.get();
    
    // Get the exact point on the curve for this scroll percentage
    const targetPosition = cameraPath.getPoint(progress);

    // Read solved state directly without triggering component re-renders
    const sysState = useCtrlFreakStore.getState();
    const isFullySolved = sysState.anc.solved && sysState.network.solved && sysState.vision.solved && sysState.logic.solved;

    // Cinematic Intro Reveal: Start behind the occlusion Monolith and push straight through it
    if (!isFullySolved && progress < 0.0075) {
      const revealP = progress / 0.0075;
      targetPosition.set(0, 80, THREE.MathUtils.lerp(160, 130, revealP));
    }
    
    // Smoothly lerp the camera towards the target position
    state.camera.position.lerp(targetPosition, 0.05);
    
    // Always look directly at the core (0, 0, 0)
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

export const SystemCore = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 50, 80], fov: 45 }}>
        <SceneExporter />
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.15} />
        
        {/* Phase 0: The Architectural Prototype */}
        <ControlChamber />
        
        {/* Phase 1: The Field (6,000 particles) */}
        <ParticleSystem scrollProgress={scrollProgress} />

        {/* Phase 1.5: Ambient Data Motes / Space Dust */}
        <AmbientDust />

        {/* Phase 2: Camera Choreography */}
        <CameraRig scrollProgress={scrollProgress} />
        
        {/* Cinematic Post-Processing */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.65}
            mipmapBlur
            radius={0.6}
          />
          <Noise opacity={0.045} />
          <Vignette eskil={false} offset={0.05} darkness={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
