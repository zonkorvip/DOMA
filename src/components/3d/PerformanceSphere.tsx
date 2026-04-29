import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useUserStore } from '@/src/store/userStore';

function AnimatedSphere({ progress }: { progress: Record<number, any> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Calculate distortion based on level 1 progress (as a proxy)
  const l1Progress = progress[1]?.highestScore / 100 || 0;
  const l2Progress = progress[2]?.highestScore / 100 || 0;
  
  const distort = 0.3 + l1Progress * 0.5;

  return (
    <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={hovered ? 1.05 : 1}>
        <MeshDistortMaterial
          color="#8A2BE2"
          emissive="#00F2FE"
          emissiveIntensity={0.2 + l2Progress}
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </group>
  );
}

export default function PerformanceSphere() {
  const progress = useUserStore((state) => state.progress);

  return (
    <div className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedSphere progress={progress} />
      </Canvas>
    </div>
  );
}
