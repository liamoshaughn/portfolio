import React, { useMemo } from 'react';
import { Shrub} from './Assets/Camp/Shrub';
import { DandelionA, DandelionB, DandelionC } from './Assets/Camp/Dandelion';
import { Pine } from './Assets/Camp/Pine';
import Grass from './Grass/Grass';
import seedrandom from 'seedrandom';



export default function Field(props) { 
  const shrubCount = 15;
  const dandelionCount = 15;
  const pineCount = 15;
  const size = 30;

  const rng = seedrandom(166);

  // Function to get positions for shrubs
  const getShrubPositions = () => {
    const exclusionBaseRadius = 6;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;

    let xPos = Math.random() * size / 5;
    let zPos = Math.random() * size / 3 - 5;

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius) {
      return getShrubPositions();
    }
    return { xPos, zPos };
  };

  // Function to get positions for dandelions
  const getDandelionPositions = () => {
    const exclusionBaseRadius = 5.5;
    const noiseAmplitude = 0.4;
    const noiseFrequency = 8;

    let xPos = Math.random() * size / 4;
    let zPos = Math.random() * size / 3 - 4;

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius) {
      return getDandelionPositions();
    }
    return { xPos, zPos };
  };

  // Function to get positions for pines
  const getTreePositions = () => {
    const exclusionBaseRadius = 5;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;

    let xPos = (rng() - 0.5) * size;
    let zPos = (rng() - 0.5) * size;

    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const angle = Math.atan2(zPos, xPos);
    const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
    const exclusionRadius = exclusionBaseRadius + noise;

    if (distanceFromCenter < exclusionRadius || xPos < -1) {
      return getTreePositions();
    }
    xPos -= 4;

    return { xPos, zPos };
  };

  const fieldPositions = useMemo(() => {
    const pinePositions = [];
    const shrubPositions = [];
    const dandelionPositions = [];

    for (let i = 0; i < shrubCount + dandelionCount * 3 + pineCount; i++) {
      if (i >= shrubCount + dandelionCount * 3) {
        const { xPos, zPos } = getTreePositions();
        pinePositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i < shrubCount) {
        const { xPos, zPos } = getShrubPositions();
        shrubPositions.push({ position: [xPos, -0.9, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else if (i >= shrubCount) {
        const { xPos, zPos } = getDandelionPositions();
        dandelionPositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      }
    }
    return { pinePositions, shrubPositions, dandelionPositions };
  }, [shrubCount, dandelionCount, pineCount]);

  const { pinePositions, shrubPositions, dandelionPositions } = fieldPositions;

  // Splitting Dandelion positions among A, B, and C
  const dandelionSplit = Math.ceil(dandelionPositions.length / 3);
  const dandelionAPositions = dandelionPositions.slice(0, dandelionSplit);
  const dandelionBPositions = dandelionPositions.slice(dandelionSplit, dandelionSplit * 2);
  const dandelionCPositions = dandelionPositions.slice(dandelionSplit * 2);

  return (
    <group>
      <Grass lightRef={props.lightRef} width={10} />
      {pinePositions.map(({ position, rotation }, index) => (
        <Pine key={`pine-${index}`} position={position} rotation={rotation} />
      ))}
      {shrubPositions.map(({ position, rotation }, index) => (
        <Shrub key={`shrub-${index}`} position={position} rotation={rotation} />
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


