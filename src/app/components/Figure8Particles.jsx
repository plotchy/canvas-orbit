'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const PARTICLE_COUNT = 1000;
const CURVE_SEGMENTS = 64;
const THICKNESS = 3.5;
const LERP_FACTOR = 0.01;
const SCALE_FACTOR = 2;

// Seed for deterministic random number generation
const FIXED_SEED = 42; // Use the same fixed seed as in route.js
let currentSeed = FIXED_SEED;

function seededRandom() {
  currentSeed = (currentSeed * 9301 + 49297) % 233280;
  return currentSeed / 233280;
}

const Figure8Particles = () => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(new THREE.Clock());
  const [textPositions, setTextPositions] = useState([]);
  
  const particlePositions = useMemo(() => new Array(PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3()), []);
  const targetPositions = useMemo(() => new Array(PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3()), []);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array(CURVE_SEGMENTS).fill(0).map((_, i) => {
        const t = i / CURVE_SEGMENTS;
        const x = Math.sin(t * Math.PI * 2) * 2 * SCALE_FACTOR;
        const y = Math.sin(t * Math.PI * 4) * SCALE_FACTOR;
        const z = Math.cos(t * Math.PI * 2) * SCALE_FACTOR;
        return new THREE.Vector3(x, y, z);
      }),
      true
    );
  }, []);

  const texts = useMemo(() => {
    currentSeed = FIXED_SEED; // Reset seed before generating texts
    return new Array(PARTICLE_COUNT).fill(0).map(() => generateRandomTicker());
  }, []);

  const radius = THICKNESS / 2;

  useEffect(() => {
    setTextPositions(particlePositions.map(pos => pos.clone()));
  }, [particlePositions]);

  useFrame(() => {
    if (meshRef.current) {
      const time = clock.current.getElapsedTime();
      const newPositions = [];
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = (i / PARTICLE_COUNT + time * 0.1) % 1;
        const { position, normal } = getPointOnTube(curve, t, radius);
        
        targetPositions[i].copy(position).add(normal.multiplyScalar(Math.random() * radius));
        particlePositions[i].lerp(targetPositions[i], LERP_FACTOR);

        dummy.position.copy(particlePositions[i]);
        dummy.scale.setScalar(0.005);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        newPositions.push(particlePositions[i].clone());
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true;
      setTextPositions(newPositions);
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
      {textPositions.map((position, index) => (
        <Html key={index} position={position} style={{ pointerEvents: 'none' }}>
          <div 
            className="particle-text" 
            style={{ width: '1px', height: '1px', opacity: 0 }}
            data-content={texts[index]}
          />
        </Html>
      ))}
    </>
  );
};

function getPointOnTube(curve, t, radius) {
  const position = new THREE.Vector3();
  const normal = new THREE.Vector3();
  curve.getPointAt(t, position);
  curve.getTangentAt(t, normal);
  const up = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3().crossVectors(up, normal).normalize();
  const radialAngle = Math.random() * Math.PI * 2;
  const binormal = new THREE.Vector3().crossVectors(normal, axis);
  const radialVector = new THREE.Vector3()
    .addScaledVector(axis, Math.cos(radialAngle))
    .addScaledVector(binormal, Math.sin(radialAngle));
  position.add(radialVector.multiplyScalar(radius));
  return { position, normal: radialVector };
}

function generateRandomTicker() {
  const tickers = ["BTC", "ETH", "LTC", "XRP", "SOL"];
  const ticker = tickers[Math.floor(seededRandom() * tickers.length)];
  const value = (seededRandom() * 10).toFixed(2);
  return `${value} ${ticker}`;
}

export default Figure8Particles;