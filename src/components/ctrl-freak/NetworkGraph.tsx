import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { HUB_POSITIONS_3D } from '../../config/networkHubs';
import { MotionValue } from 'framer-motion';

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function NetworkGraph({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const { frankfurt, london, mumbai, solved } = useCtrlFreakStore((s) => s.network);

  const frankfurtRef = useRef<THREE.Mesh>(null);
  const londonRef = useRef<THREE.Mesh>(null);
  const mumbaiRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = scrollProgress.get();
    const isVisible = progress > 0.35 && progress <= 0.50;
    
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Shift group dynamically to the left to match the UI gap
    const t = smoothstep(0.35, 0.40, progress);
    const targetOffsetX = 9 - 18 * t; // Ends up at -9 (Left side)
    
    const rightVec = new THREE.Vector3(1, 0, 0).applyQuaternion(state.camera.quaternion);
    const targetPos = new THREE.Vector3(0, 0, 0).add(rightVec.multiplyScalar(targetOffsetX));
    
    // Add Gentle bob
    const time = state.clock.getElapsedTime();
    targetPos.y += Math.sin(time * 0.3) * 0.3;
    
    groupRef.current.position.lerp(targetPos, 0.1);
    groupRef.current.scale.setScalar(0.9);

    // Animate individual nodes based on load
    const updateNode = (mesh: THREE.Mesh | null, load: number, maxLoad: number, isMumbai: boolean) => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshBasicMaterial;
      
      const overloaded = load > maxLoad;
      const scale = 1 + (load / 100) * 1.5;
      
      mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      
      if (solved) {
        material.color.lerp(new THREE.Color('#33ff33'), 0.1);
      } else if (overloaded || (isMumbai && load > 40)) {
        material.color.lerp(new THREE.Color('#ff3333'), 0.2);
        // Shake if overloaded
        mesh.position.x += (Math.random() - 0.5) * 0.2;
        mesh.position.y += (Math.random() - 0.5) * 0.2;
        mesh.position.z += (Math.random() - 0.5) * 0.2;
      } else {
        material.color.lerp(new THREE.Color('#3388ff'), 0.1);
      }
    };

    updateNode(frankfurtRef.current, frankfurt, 100, false);
    updateNode(londonRef.current, london, 70, false);
    updateNode(mumbaiRef.current, mumbai, 40, true);
  });

  return (
    <group ref={groupRef}>
      
      {/* Frankfurt */}
      <group position={HUB_POSITIONS_3D[2]}>
        <mesh ref={frankfurtRef}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#3388ff" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      </group>

      {/* London */}
      <group position={HUB_POSITIONS_3D[4]}>
        <mesh ref={londonRef}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#3388ff" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      </group>

      {/* Mumbai */}
      <group position={HUB_POSITIONS_3D[3]}>
        <mesh ref={mumbaiRef}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#ff3333" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      </group>

    </group>
  );
}