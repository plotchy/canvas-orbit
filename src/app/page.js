"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingParticles from "./components/FloatingParticles";
import Figure8Particles from "./components/Figure8Particles";
import Overlay from "./components/Overlay";

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        camera={{ position: [0, 0, 4], fov: 75 }}
      >
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={15}
        />
        <FloatingParticles />
        <Figure8Particles />
      </Canvas>
      <Overlay />
    </main>
  );
}
