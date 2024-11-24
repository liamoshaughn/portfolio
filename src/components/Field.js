import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { ShrubA, ShrubB, Model } from './Campfire/Assets/Shrub';
import { DandelionA, DandelionB, DandelionC } from './Campfire/Assets/Dandelion';
import { Pine } from './Campfire/Assets/Pine';
import Grass from './Grass/Grass';

export default function Field(props) {
  
  const grassClumpCount = 1000; // Number of grass clumps
  const grassPerClump = 20; // Grass blades per clump
  const shrubCount = 100;
  const dandelionCount = 100; // Total dandelions (split among A, B, C)
  const pineCount = 20;



  const getPositions = () => {
    const size = 50;
    const exclusionBaseRadius = 10;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;

    let xPos = (Math.random() - 0.5) * size;
    let zPos = (Math.random() - 0.5) * size;

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius) {
      return getPositions();
    }
    return { xPos, zPos };
  };

  const fieldPositions = useMemo(() => {
    const positions = [];
    const pinePositions = [];
    const shrubPositions = [];
    const dandelionPositions = [];

    for (let i = 0; i < grassClumpCount + shrubCount + dandelionCount * 3 + pineCount; i++) {
      const { xPos, zPos } = getPositions();

      if (i >= grassClumpCount + shrubCount + dandelionCount * 3) {
        pinePositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i >= grassClumpCount && i < grassClumpCount + shrubCount) {
        shrubPositions.push({ position: [xPos, -0.9, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i >= grassClumpCount + shrubCount) {
        dandelionPositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else {
        // For grass clumps, generate multiple blades per clump
        const clumpSize = 1.5;
        for (let j = 0; j < grassPerClump; j++) {
          const randomX = xPos + (Math.random() - 0.5) * clumpSize;
          const randomZ = zPos + (Math.random() - 0.5) * clumpSize;
          positions.push({
            position: new THREE.Vector3(randomX, -0.7, randomZ),
            rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
            scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1),
            type: 'grass',
          });
        }
      }
    }
    return { positions, pinePositions, shrubPositions, dandelionPositions };
  }, [grassClumpCount, shrubCount, dandelionCount, pineCount]);

  const { pinePositions, shrubPositions, dandelionPositions } = fieldPositions;

  // Splitting Dandelion positions among A, B, and C
  const dandelionSplit = Math.ceil(dandelionPositions.length / 3);
  const dandelionAPositions = dandelionPositions.slice(0, dandelionSplit);
  const dandelionBPositions = dandelionPositions.slice(dandelionSplit, dandelionSplit * 2);
  const dandelionCPositions = dandelionPositions.slice(dandelionSplit * 2);

  // Splitting Shrubs
  const shrubSplit = Math.ceil(shrubPositions.length / 2);
  const firstShrub = shrubPositions.slice(0, shrubSplit);
  const secondShrub = shrubPositions.slice(shrubSplit);


  return (
    <group>
        <Grass width={80} instances={20000}/>
      {pinePositions.map(({ position, rotation }, index) => (
        <Pine key={`pine-${index}`} position={position} rotation={rotation} />
      ))}
      {firstShrub.map(({ position, rotation }, index) => (
        <ShrubA key={`shrubA-${index}`} position={position} rotation={rotation} />
      ))}
      {secondShrub.map(({ position, rotation }, index) => (
        <ShrubB key={`shrubB-${index}`} position={position} rotation={rotation} />
      ))}
      {dandelionAPositions.map(({ position, rotation }, index) => (
        <DandelionA key={`dandelionA-${index}`} position={position} rotation={rotation} />
      ))}
      {dandelionBPositions.map(({ position, rotation }, index) => (
        <DandelionB key={`dandelionB-${index}`} position={position} rotation={rotation} />
      ))}
      {dandelionCPositions.map(({ position, rotation }, index) => (
        <DandelionC key={`dandelionC-${index}`} position={position} rotation={rotation} />
      ))}
    </group>
  );
}

