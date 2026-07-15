import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Torus, Octahedron, Sphere, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

const AIFighter = ({ position, color, speed, invertRotation, isDark }: { position: [number, number, number], color: string, speed: number, invertRotation?: boolean, isDark: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.5;
    }
    if (meshRef.current) {
      const rotSpeed = invertRotation ? -speed : speed;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * rotSpeed * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * rotSpeed * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Trail width={1.5} color={color} length={8} decay={1} local={false}>
        <Float speed={speed * 2} rotationIntensity={2} floatIntensity={2}>
          <Octahedron ref={meshRef} args={[0.6, 0]}>
            <meshStandardMaterial 
              color={color} 
              emissive={color}
              emissiveIntensity={isDark ? 1.5 : 0.8}
              wireframe={false}
              transparent
              opacity={0.9}
            />
          </Octahedron>
        </Float>
      </Trail>
      
      {/* Outer shield */}
      <Sphere args={[1.0, 16, 16]}>
        <meshStandardMaterial 
          color={color}
          wireframe
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={isDark ? 1 : 0.5}
        />
      </Sphere>
    </group>
  );
}

const BattleArena = ({ theme }: { theme: string }) => {
  const arenaRef = useRef<THREE.Group>(null);
  const isDark = theme === 'dark';

  useFrame((state) => {
    if (arenaRef.current) {
      arenaRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
      arenaRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1 + Math.PI / 2;
    }
  });

  return (
    <group ref={arenaRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Outer Arena Ring */}
      <Torus args={[4, 0.05, 16, 100]}>
        <meshStandardMaterial 
          color={isDark ? "#8b5cf6" : "#6d28d9"} 
          emissive={isDark ? "#8b5cf6" : "#6d28d9"} 
          emissiveIntensity={isDark ? 1 : 0.5}
          transparent
          opacity={isDark ? 0.4 : 0.2}
        />
      </Torus>
      
      {/* Inner Arena Grid/Rings */}
      <Torus args={[2.5, 0.02, 16, 64]}>
         <meshStandardMaterial 
          color={isDark ? "#38bdf8" : "#0284c7"} 
          emissive={isDark ? "#38bdf8" : "#0284c7"} 
          emissiveIntensity={isDark ? 1 : 0.5}
          transparent
          opacity={isDark ? 0.4 : 0.2}
        />
      </Torus>

      {/* Grid lines inside arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 4, 32, 8]} />
        <meshBasicMaterial 
          color={isDark ? "#8b5cf6" : "#6d28d9"} 
          wireframe
          transparent
          opacity={isDark ? 0.1 : 0.05}
        />
      </mesh>
    </group>
  );
}

const BattleSceneCore = ({ theme }: { theme: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDark = theme === 'dark';

  const fighter1Color = isDark ? "#d946ef" : "#c026d3"; // Fuchsia
  const fighter2Color = isDark ? "#0ea5e9" : "#0284c7"; // Sky

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      <BattleArena theme={theme} />
      
      <group ref={groupRef}>
        <AIFighter position={[-2.5, 0, 0]} color={fighter1Color} speed={1.5} isDark={isDark} />
        <AIFighter position={[2.5, 0, 0]} color={fighter2Color} speed={1.2} invertRotation={true} isDark={isDark} />
      </group>

      {/* Center Clash Energy */}
      <Sphere args={[0.6, 32, 32]}>
        <MeshDistortMaterial 
          color={isDark ? "#a855f7" : "#7e22ce"}
          emissive={isDark ? "#a855f7" : "#7e22ce"}
          emissiveIntensity={isDark ? 1.5 : 0.8}
          distort={0.4}
          speed={4} 
          transparent
          opacity={0.6}
        />
      </Sphere>
    </group>
  );
};

export const ThreeDScene = ({ theme }: { theme: string }) => {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center ${theme === "dark" ? "opacity-80" : "opacity-[0.85]"}`}>
      <Canvas camera={{ position: [0, 3, 9], fov: 45 }}>
        <ambientLight intensity={theme === "dark" ? 0.6 : 0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        <BattleSceneCore theme={theme} />
        {theme === 'dark' && <Stars radius={50} depth={50} count={3000} factor={2} saturation={1} fade speed={1.5} />}
      </Canvas>
    </div>
  );
};
