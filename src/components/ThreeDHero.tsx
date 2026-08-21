'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial
          color="#3b82f6"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.5}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

export function ThreeDHero() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedShape />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  )
}
