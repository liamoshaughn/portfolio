import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { Shrub} from './Assets/Shrub';
import { DandelionA, DandelionB, DandelionC } from './Assets/Dandelion';
import { Pine } from './Assets/Pine';
import Grass from './Grass/Grass';
import seedrandom from 'seedrandom';


export default function Field(props) { 
  const shrubCount = 8;
  const dandelionCount = 10;
  const pineCount = 10;
  const size = 30;

  // Create a random number generator with the seed
  const rng = seedrandom(3);



  const getPositions = () => {
    
    const exclusionBaseRadius = 5;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;

    let xPos = Math.random() * size/2;
    let zPos = Math.random() * size/2 -8;
   

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius) {
      return getPositions();
    }
    return { xPos, zPos };
  };

  const getTreePositions = () => {
    const exclusionBaseRadius = 10;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;

    let xPos = (rng() - 0.5) * size;
    let zPos = (rng() - 0.5) * size;

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius || xPos < 6) {
      return getTreePositions();
    }
    return { xPos, zPos };
  };

  const fieldPositions = useMemo(() => {

    const pinePositions = [];
    const shrubPositions = [];
    const dandelionPositions = [];

    for (let i = 0; i <  shrubCount + dandelionCount * 3 + pineCount; i++) {
      

      if (i >=  shrubCount + dandelionCount * 3) {
        const { xPos, zPos } = getTreePositions();
        pinePositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i <  + shrubCount) {
        const { xPos, zPos } = getPositions();
        shrubPositions.push({ position: [xPos, -0.9, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i >=  shrubCount) {
        const { xPos, zPos } = getPositions();
        dandelionPositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      }
    }
    return { pinePositions, shrubPositions, dandelionPositions };
  }, [ shrubCount, dandelionCount, pineCount]);

  const { pinePositions, shrubPositions, dandelionPositions } = fieldPositions;

  // Splitting Dandelion positions among A, B, and C
  const dandelionSplit = Math.ceil(dandelionPositions.length / 3);
  const dandelionAPositions = dandelionPositions.slice(0, dandelionSplit);
  const dandelionBPositions = dandelionPositions.slice(dandelionSplit, dandelionSplit * 2);
  const dandelionCPositions = dandelionPositions.slice(dandelionSplit * 2);


  return (
    <group>
        <Grass lightRef={props.lightRef} width={80} instances={500000}/>
      {pinePositions.map(({ position, rotation }, index) => (
        <Pine key={`pine-${index}`} position={position} rotation={rotation} />
      ))}
      {shrubPositions.map(({ position, rotation }, index) => (
        <Shrub key={`shrubA-${index}`} position={position} rotation={rotation} />
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

