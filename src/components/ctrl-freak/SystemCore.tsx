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
      const waveX = (i / count) * 40 - 20; // Widen to span -20 to 20
      let waveY = i % 2 === 0 ? 3.5 : -3.5; // Spread vertically by 7 units
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

    if (progress < 0.14) {
      shape1 = shapes.sphere; shape2 = shapes.sphere; lerpFactor = 0;
    } else if (progress < 0.26) {
      shape1 = shapes.sphere; shape2 = shapes.wave; lerpFactor = smoothstep(0.14, 0.26, progress);
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
      
      // Get exact dynamic position for a given base shape
      const getDynamicPos = (shapeBase: Float32Array) => {
        let bx = shapeBase[i3];
        let by = shapeBase[i3+1];
        let bz = shapeBase[i3+2];

        if (shapeBase === shapes.sphere) {
          const state = useCtrlFreakStore.getState();
          const isFullySolved = state.anc.solved && state.network.solved && state.vision.solved && state.logic.solved;
          
          if (isFullySolved) {
            // VISUAL PAYOFF: Glorious Golden Ratio / Sacred Geometry Torus Knot
            const pRatio = i / count;
            const u = pRatio * Math.PI * 2 * 7; // 7 loops
            const v = pRatio * Math.PI * 2 * 3; // 3 loops
            
            // Torus Knot parametric equation (Massively scaled up)
            const r = 25 + 8 * Math.cos(v);
            bx = r * Math.cos(u);
            by = r * Math.sin(u);
            bz = 8 * Math.sin(v);
            
            // Majestic slow rotation on multiple axes
            const sY = Math.sin(t * 0.4);
            const cY = Math.cos(t * 0.4);
            const tempX = bx * cY - bz * sY;
            bz = bx * sY + bz * cY;
            bx = tempX;
            
            const sZ = Math.sin(t * 0.2);
            const cZ = Math.cos(t * 0.2);
            const tempY = by * cZ - bx * sZ;
            bx = by * sZ + bx * cZ;
            by = tempY;
            
          } else {
            // Base state: Stable, calm sphere (no chaotic jittering)
            const scrollExpansion = Math.sin(Math.min(1, progress / 0.28) * Math.PI);
            const expansion = 1 + (scrollExpansion * 0.5); // Subtle, controlled expansion
            
            // Add a very calm, slow breathing effect so it feels alive but not chaotic
            const breathe = 1 + Math.sin(t * 1.5 + (i % 10)) * 0.05;
            
            bx = bx * expansion * breathe;
            by = by * expansion * breathe;
            bz = bz * expansion * breathe;
          }
        } else if (shapeBase === shapes.wave) {
          const isTop = i % 2 === 0;
          const ancPhase = useCtrlFreakStore.getState().anc.phase;
          const targetPhaseOffset = (Math.PI / 180) * (ancPhase - 180);
          const errorMagnitude = Math.min(1, Math.abs(ancPhase - 180) / 180);
          const currentPhaseOffset = isTop ? 0 : targetPhaseOffset;
          const amplitudeJitter = (Math.random() - 0.5) * errorMagnitude * 4.0;
          const amplitude = 6.0 + amplitudeJitter; // Increased amplitude to fill space
          const scatterX = (Math.random() - 0.5) * errorMagnitude * 2.0;
          const scatterY = (Math.random() - 0.5) * errorMagnitude * 2.0;
          const scatterZ = (Math.random() - 0.5) * errorMagnitude * 3.0;

          bx += scatterX;
          // Adjusted frequency to 0.8 so it looks mathematically perfect over the wider 40-unit span
          by += Math.sin(bx * 0.8 + t * 2 + currentPhaseOffset) * amplitude + scatterY;
          bz += Math.sin(bx * 1.0 + t) * 2.5 + scatterZ;
        } else if (shapeBase === shapes.network) {
          const net = useCtrlFreakStore.getState().network;
          const bridgeIdx = Math.floor(i / (count / 3));
          const load = bridgeIdx === 0 ? net.frankfurt : bridgeIdx === 1 ? net.london : net.mumbai;
          const bridgeY = bridgeIdx === 0 ? 5 : bridgeIdx === 1 ? 0 : -5;
          let criticalLimit = 100;
          if (bridgeIdx === 0) criticalLimit = 85;
          else if (bridgeIdx === 1) criticalLimit = 70;
          else if (bridgeIdx === 2) criticalLimit = net.resolution === '4K' ? 15 : 40;
          
          const seed = Math.abs(Math.sin(i * 12.9898 + 78.233));
          const speed = net.solved ? 2.0 : (0.2 + (load / 100) * 1.5);
          const rawP = (seed + (t * speed * 0.5)) % 1.0;
          
          bx = -12 + rawP * 24;
          
          let pulse = 1.0;
          const isWarning = !net.solved && load >= criticalLimit - 10 && load <= criticalLimit;
          if (isWarning) pulse = 1.0 + Math.abs(Math.sin(t * 15)) * 0.4;
          
          const baseThick = net.solved ? 0.05 : (0.02 + Math.min(load, criticalLimit) / 100 * 0.3) * pulse;
          const crossAngle = Math.abs(Math.sin(i * 43.111)) * Math.PI * 2;
          const dist = Math.abs(Math.sin(i * 99.999));
          
          by = bridgeY + Math.cos(crossAngle) * baseThick * dist;
          bz = Math.sin(crossAngle) * baseThick * dist;
          
          if (!net.solved && load > criticalLimit) {
            const ruptureFactor = (load - criticalLimit) / (100 - criticalLimit + 1);
            if (Math.abs(Math.sin(i * 11.111)) < ruptureFactor * 0.6) {
               const fallTime = (t * 4 + seed * 10) % 3;
               by -= (fallTime * fallTime * 3);
               bx += (Math.cos(i) * fallTime * 3);
            }
          }
          if (!net.solved && load < 15) {
             if (Math.abs(Math.sin(i * 0.5 + t * 4)) > 0.4) {
                bx *= 0.01; by *= 0.01; bz *= 0.01;
             }
          }
        } else if (shapeBase === shapes.circuit) {
          const logic = useCtrlFreakStore.getState().logic;
          const vaultType = Math.floor((i / count) * 3);
          const vTheta = Math.abs(Math.sin(i * 12.9898)) * Math.PI * 2;
          const teeth = (Math.sin(vTheta * 12) > 0.5 ? 0.3 : 0);
          
          let vR = 0, vZ = 0;
          if (vaultType === 0) {
            vR = 6.0 + Math.abs(Math.sin(i * 78.233)) * 1.0 + teeth;
            vZ = -3.0 + Math.abs(Math.sin(i * 43.111)) * 2.0;
          } else if (vaultType === 1) {
            vR = 4.5 + Math.abs(Math.sin(i * 78.233)) * 1.0 + teeth;
            vZ = -0.5 + Math.abs(Math.sin(i * 43.111)) * 2.0;
          } else {
            vR = 3.0 + Math.abs(Math.sin(i * 78.233)) * 1.0 + teeth;
            vZ = 2.0 + Math.abs(Math.sin(i * 43.111)) * 2.0;
          }
          
          let rotOffset = 0, zOffset = 0;
          if (logic.solved) {
            rotOffset = t * 0.2;
            if (vaultType === 0) zOffset = -6.0;
            if (vaultType === 1) zOffset = -3.0;
            if (vaultType === 2) zOffset = 3.0;
          } else {
            if (vaultType === 1) {
              if (logic.slot1Correct) rotOffset = 0;
              else if (logic.slot1 !== null) {
                rotOffset = (t * 0.5) + (Math.sin(t * 30) * 0.05); 
                vR += (Math.abs(Math.sin(i * 12.9898 + t)) - 0.5) * 0.3;
              } else rotOffset = t * 0.8;
            }
            if (vaultType === 2) {
              if (logic.slot2Correct) rotOffset = 0;
              else if (logic.slot2 !== null) {
                rotOffset = -(t * 0.6) + (Math.sin(t * 35) * 0.05); 
                vR += (Math.abs(Math.sin(i * 78.233 + t)) - 0.5) * 0.3;
              } else rotOffset = -t * 0.7;
            }
          }
          
          const finalTheta = vTheta + rotOffset;
          bx = Math.cos(finalTheta) * vR;
          by = Math.sin(finalTheta) * vR;
          bz = vZ + zOffset;
        }

        return [bx, by, bz];
      };

      const [m1x, m1y, m1z] = getDynamicPos(shape1);
      const [m2x, m2y, m2z] = getDynamicPos(shape2);

      const x = m1x + (m2x - m1x) * lerpFactor;
      const y = m1y + (m2y - m1y) * lerpFactor;
      const z = m1z + (m2z - m1z) * lerpFactor;

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
  // Original cinematic spline for the investigation journey
  const cameraPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 200),    // 0.0: Straight on, far back - core centered, arms overhead
      new THREE.Vector3(0, 0, 50),     // 0.2: Core Center (lower, slightly further back)
      new THREE.Vector3(-35, -5, 25),  // 0.35: Station 1 (Left Low)
      new THREE.Vector3(35, -5, 20),   // 0.5: Station 2 (Right Lower)
      new THREE.Vector3(30, 25, -20),  // 0.65: Station 3 (Right High)
      new THREE.Vector3(-20, 15, -20), // 0.8: Station 4 (Back Left High)
      new THREE.Vector3(0, 0, 35),     // 1.0: Final Clock (Straight ahead, eye-level with the massive hands)
    ], false, 'catmullrom', 0.5);
  }, []);

  // Once fully solved and user scrolls back up, use this cinematic spiral tour path
  const revealPath = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -30, 100),   // 0.0: The Hero Shot. Low angle, towering hands grasping the massive core.
      new THREE.Vector3(70, -10, 60),   // 0.2: Sweeping out right, wide orbit
      new THREE.Vector3(90, 25, -20),   // 0.4: Deep orbit around the right forearm gauntlet
      new THREE.Vector3(30, 40, -40),   // 0.6: Sweeping over the back and far above the arches
      new THREE.Vector3(-60, 15, -20),  // 0.8: Coasting across the top left shoulder
      new THREE.Vector3(0, 0, 35),      // 1.0: End at the Clock (Matches the investigation end point)
    ], false, 'catmullrom', 0.5);
  }, []);

  const hasSeenSolved = useRef(false);
  const transitionRef = useRef(0); // For smooth blending between journey and reveal cameras

  useFrame((state, delta) => {
    const progress = scrollProgress.get();
    
    const sysState = useCtrlFreakStore.getState();
    const isFullySolved = sysState.anc.solved && sysState.network.solved && sysState.vision.solved && sysState.logic.solved;

    // Track if user has ever reached fully solved state
    if (isFullySolved) hasSeenSolved.current = true;

    // If fully solved, hijack the ENTIRE scroll path for the tour
    const isRevealMode = hasSeenSolved.current && isFullySolved;
    
    // Smoothly blend between 0 (Investigation) and 1 (Reveal)
    transitionRef.current = THREE.MathUtils.damp(transitionRef.current, isRevealMode ? 1 : 0, 2, delta);

    // Calculate investigation position
    const invPos = cameraPath.getPoint(progress);
    
    // Cinematic Intro Reveal: start pulled back slightly further behind the monolith
    if (!isFullySolved && progress < 0.0075) {
      const revealP = progress / 0.0075;
      invPos.set(0, 0, THREE.MathUtils.lerp(220, 200, revealP));
    }

    // Calculate cinematic tour position
    let finalPos = invPos;
    if (transitionRef.current > 0.001) {
      const tourPos = revealPath.getPoint(progress);
      finalPos = invPos.clone().lerp(tourPos, transitionRef.current);
    }
    
    // Shift framing rightwards during the hero shot reveal to avoid the UI text on the left
    const panOffset = THREE.MathUtils.lerp(0, -30, transitionRef.current * (1 - progress));
    const lookTarget = new THREE.Vector3(panOffset, 0, 0);
    
    // Smoothly lerp the camera towards the target position
    state.camera.position.lerp(finalPos, 0.05);
    
    state.camera.lookAt(lookTarget);
  });

  return null;
};

export const SystemCore = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 40, 220], fov: 55 }}>
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
