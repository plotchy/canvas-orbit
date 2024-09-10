'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const FLOATING_PARTICLE_COUNT = 150; // Increased for more background particles
const SCENE_SIZE = 150; // Increased to cover a larger area

const FloatingParticles = () => {
  const { camera } = useThree();
  const instancedMesh = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [textPositions, setTextPositions] = useState([]);
  
  const positions = useMemo(() => new Array(FLOATING_PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3(
    (Math.random() - 0.5) * SCENE_SIZE,
    (Math.random() - 0.5) * SCENE_SIZE,
    (Math.random() - 0.5) * SCENE_SIZE
  )), []);

  const velocities = useMemo(() => new Array(FLOATING_PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01,
    (Math.random() - 0.5) * 0.01
  )), []);

  const texts = useMemo(() => new Array(FLOATING_PARTICLE_COUNT).fill(0).map(() => 
    generateRandomText()
  ), []);

  useEffect(() => {
    setTextPositions(positions.map(pos => pos.clone()));
  }, [positions]);

  useFrame((state, delta) => {
    if (instancedMesh.current) {
      const newPositions = [];
      for (let i = 0; i < FLOATING_PARTICLE_COUNT; i++) {
        // Update position
        positions[i].add(velocities[i]);

        // Boundary check and velocity reversal
        ['x', 'y', 'z'].forEach((axis) => {
          if (Math.abs(positions[i][axis]) > SCENE_SIZE / 2) {
            positions[i][axis] = Math.sign(positions[i][axis]) * SCENE_SIZE / 2;
            velocities[i][axis] *= -1;
          }
        });

        // Small random velocity change
        velocities[i].add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.0001,
          (Math.random() - 0.5) * 0.0001,
          (Math.random() - 0.5) * 0.0001
        ));

        // Apply position to instance
        dummy.position.copy(positions[i]);
        dummy.scale.setScalar(0.05); // Decreased size for background effect
        dummy.updateMatrix();
        instancedMesh.current.setMatrixAt(i, dummy.matrix);

        newPositions.push(positions[i].clone());
      }
      instancedMesh.current.instanceMatrix.needsUpdate = true;
      setTextPositions(newPositions);
    }
  });

  return (
    <>
      <instancedMesh ref={instancedMesh} args={[undefined, undefined, FLOATING_PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </instancedMesh>
      {textPositions.map((position, index) => (
        <Html key={index} position={position} style={{ pointerEvents: 'none' }}>
          <div className="particle-text" style={{ color: 'white', fontSize: '10px' }}>
            {texts[index].content}
          </div>
        </Html>
      ))}
    </>
  );
};

function generateRandomText() {
  const texts = ["seek", "and", "you", "will", "find", "the", "answer"];
  return {
    content: texts[Math.floor(Math.random() * texts.length)],
    position: new THREE.Vector3()
  };
}

export default FloatingParticles;