import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { ControlChamber } from './ControlChamber';
// A massive, glitching point cloud that evolves into specific formations based on scroll progress
const ParticleSystem = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const count = 6000; // Increased count for better shape definition
  
  // Pre-calculate all target shapes
  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const sine = new Float32Array(count * 3);
    const network = new Float32Array(count * 3);
    const grid = new Float32Array(count * 3);
    const circuit = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);

    const nodes = [
      [-3, 2, 0], [3, 1.5, 0], [0, -2, 0], [-2, -1, 0], [2, -1.5, 0]
    ];

    const gridSize = Math.ceil(Math.sqrt(count));

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
      const x = (Math.random() - 0.5) * 12; // span width
      const isTop = i % 2 === 0;
      sine[i3] = x;
      sine[i3 + 1] = isTop ? 1 : -1; // Y offset base
      sine[i3 + 2] = (Math.random() - 0.5) * 0.5;

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

      // 4. GRID (Vision Binarization)
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      grid[i3] = (col / gridSize - 0.5) * 12;
      grid[i3 + 1] = (row / gridSize - 0.5) * 12;
      grid[i3 + 2] = (Math.random() - 0.5) * 0.2;

      // 5. CIRCUIT (Logic gates/traces)
      const isHorizontal = Math.random() > 0.5;
      const track = Math.floor((Math.random() - 0.5) * 16); // 16 discrete tracks
      const distance = (Math.random() - 0.5) * 10;
      if (isHorizontal) {
        circuit[i3] = distance;
        circuit[i3 + 1] = track * 0.4;
      } else {
        circuit[i3] = track * 0.4;
        circuit[i3 + 1] = distance;
      }
      circuit[i3 + 2] = (Math.random() - 0.5) * 0.2;

      // 6. RING (The Clock / 12:00)
      const angle = Math.random() * Math.PI * 2;
      const ringRadius = 4.5 + (Math.random() - 0.5) * 1.5;
      ring[i3] = Math.cos(angle) * ringRadius;
      ring[i3 + 1] = Math.sin(angle) * ringRadius;
      ring[i3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    return { sphere, sine, network, grid, circuit, ring };
  }, [count]);

  // Initial render buffer
  const [positions] = useState(() => new Float32Array(count * 3));

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
    // 0.20 - 0.25: Transition -> Sine
    // 0.25 - 0.35: Sine (ANC)
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
      shape1 = shapes.sphere; shape2 = shapes.sine; lerpFactor = smoothstep(0.20, 0.25, progress);
    } else if (progress < 0.35) {
      shape1 = shapes.sine; shape2 = shapes.sine; lerpFactor = 0;
    } else if (progress < 0.40) {
      shape1 = shapes.sine; shape2 = shapes.network; lerpFactor = smoothstep(0.35, 0.40, progress);
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

    // Dynamic color morphing based on scroll depth
    const material = pointsRef.current.material as THREE.PointsMaterial;
    // Starts harsh red, ends pure cyan
    const r = Math.max(0.1, 1.0 - progress * 1.5);
    const g = Math.min(1.0, 0.2 + (progress * 1.2));
    const b = Math.min(1.0, 0.2 + (progress * 1.2));
    material.color.setRGB(r, g, b);

    // Apply the morphing and specific shape animations
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Base morph interpolation
      let x = shape1[i3] + (shape2[i3] - shape1[i3]) * lerpFactor;
      let y = shape1[i3 + 1] + (shape2[i3 + 1] - shape1[i3 + 1]) * lerpFactor;
      let z = shape1[i3 + 2] + (shape2[i3 + 2] - shape1[i3 + 2]) * lerpFactor;

      // Add specific shape animations based on which shape we are currently at
      
      // SINE WAVE ANIMATION (Active when shape1 or shape2 is sine)
      if (shape1 === shapes.sine || shape2 === shapes.sine) {
        // Calculate how much "sine" behavior to apply
        const sineWeight = shape1 === shapes.sine ? (1 - lerpFactor) : lerpFactor;
        if (sineWeight > 0) {
          const isTop = i % 2 === 0;
          // The bottom wave starts out of phase and slowly aligns as progress increases through the section (0.25 to 0.35)
          const localProgress = Math.max(0, Math.min(1, (progress - 0.25) / 0.10));
          const phaseOffset = isTop ? 0 : Math.PI * (1 - localProgress); // Approaches 0 offset as user scrolls down
          
          // Add sine wave height to Y
          y += Math.sin(x * 1.5 + t * 2 + phaseOffset) * 0.8 * sineWeight;
        }
      }

      // SPHERE JITTER (Arrival)
      if (shape1 === shapes.sphere && progress < 0.25) {
        const chaos = Math.max(0, 1 - (progress * 4));
        const glitch = chaos > 0.1 && Math.random() > 0.95 ? 1.2 : 1;
        x *= glitch; y *= glitch; z *= glitch;
      }

      // RING ROTATION (Clock)
      if (shape1 === shapes.ring || shape2 === shapes.ring) {
        const ringWeight = shape1 === shapes.ring ? (1 - lerpFactor) : lerpFactor;
        if (ringWeight > 0) {
           // Rotate the ring around Y axis
           const angle = Math.atan2(z, x) + t * 0.5 * ringWeight;
           const radius = Math.sqrt(x*x + z*z);
           x = Math.cos(angle) * radius;
           z = Math.sin(angle) * radius;
        }
      }

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }
    
    posAttribute.needsUpdate = true;
    
    // Global rotation to give life
    pointsRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    pointsRef.current.rotation.x = Math.cos(t * 0.1) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff3333"
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const SystemCore = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        
        {/* Phase 0: The Architectural Prototype */}
        <ControlChamber />
        
        {/* Phase 1: The Field (6,000 particles) */}
        <ParticleSystem scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
