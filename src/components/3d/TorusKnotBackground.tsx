import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TorusKnot, Stars } from '@react-three/drei';
import LoginParticles from './LoginParticles';

export default function TorusKnotBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <TorusKnot args={[1.5, 0.4, 128, 16]} position={[0, 0, 0]}>
            <meshPhongMaterial
              color="#8A2BE2"
              emissive="#00F2FE"
              wireframe
              transparent
              opacity={0.3}
            />
          </TorusKnot>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <LoginParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
