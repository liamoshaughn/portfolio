import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { DandelionA, DandelionB, DandelionC } from './Assets/Dandelion';


export default function DandelionField(props) {

  const dandelionCount = 500;

  const size = 100;


  const getPositions = () => {
    
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
    const dandelionPositions = [];

    for (let i = 0; i < dandelionCount * 3; i++) {
    
        const { xPos, zPos } = getPositions();
        dandelionPositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      
    }
    return { dandelionPositions };
  }, [ dandelionCount]);

  const { dandelionPositions } = fieldPositions;

  // Splitting Dandelion positions among A, B, and C
  const dandelionSplit = Math.ceil(dandelionPositions.length / 3);
  const dandelionAPositions = dandelionPositions.slice(0, dandelionSplit);
  const dandelionBPositions = dandelionPositions.slice(dandelionSplit, dandelionSplit * 2);
  const dandelionCPositions = dandelionPositions.slice(dandelionSplit * 2);


  return (
    <group>
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

