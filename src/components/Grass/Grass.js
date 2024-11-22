import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import bladeDiffuse from './resources/blade_diffuse.jpg';
import bladeAlpha from './resources/blade_alpha.jpg';
import { ShrubA, ShrubB } from '../Campfire/Assets/Shrub';
import { DandelionA, DandelionB, DandelionC } from '../Campfire/Assets/Dandelion';
import { Pine } from '../Campfire/Assets/Pine';

export default function GrassField(props) {
  const [diffuseTexture, alphaTexture] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha]);
  const grassRef = useRef();
  const shrubRef = useRef();
  const dandelionARef = useRef();
  const dandelionBRef = useRef();
  const dandelionCRef = useRef();

  const grassClumpCount = 1000; // Number of grass clumps
  const grassPerClump = 20; // Grass blades per clump
  const shrubCount = 100;
  const dandelionCount = 100; // Split among A, B, and C
  const pineCount = 20;

  const { geometry: shrubAGeometry, material: shrubAMaterial } = ShrubA();
  const { geometry: shrubBGeometry, material: shrubBMaterial } = ShrubB();
  const { geometry: dandelionAGeometry, material: dandelionAMaterial } = DandelionA();
  const { geometry: dandelionBGeometry, material: dandelionBMaterial } = DandelionB();
  const { geometry: dandelionCGeometry, material: dandelionCMaterial } = DandelionC();
  const geometry = useMemo(() => {
    const segments = 20;
    const geom = new THREE.PlaneGeometry(0.1, 1, 1, segments);
    const positions = geom.attributes.position.array;
    const bendAmount = 0.4;
    const straightThreshold = 0.05;

    for (let i = 0; i < positions.length; i += 3) {
      const yPos = positions[i + 1];
      const normalizedHeight = yPos / 1;
      if (normalizedHeight > straightThreshold) {
        const curveValue = Math.pow((normalizedHeight - straightThreshold) / (1 - straightThreshold), 2) * bendAmount;
        positions[i + 2] += curveValue;
      }
    }
    geom.scale(0.3, 0.3, 0.3);
    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals();

    return geom;
  }, []);

  const getPositions = () => {
    const size = 50
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
      return getPositions()  
    }
    return {xPos, zPos}
  }

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fieldPositions = useMemo(() => {
    const positions = [];
    const pinePositions = [];


    let dandelionIndexA = 0;
    let dandelionIndexB = 0;
    let dandelionIndexC = 0;

    for (let i = 0; i < grassClumpCount + shrubCount + dandelionCount * 3 + pineCount; i++) {
      console.log(grassClumpCount + shrubCount + dandelionCount * 3)
      const {xPos, zPos } = getPositions();

      if (i >= grassClumpCount + shrubCount + dandelionCount * 3) {
        pinePositions.push({ position: [xPos, -0.7, zPos], rotation: [0, Math.random() * Math.PI * 2, 0] });
      } else {
        const isShrub = i >= grassClumpCount && i < grassClumpCount + shrubCount ;
        const isDandelion = i >= grassClumpCount + shrubCount;
        if (isShrub) {
          positions.push({
            position: new THREE.Vector3(xPos, -0.9, zPos),
            rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
            scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1),
            type: 'shrub',
          });
        } else if (isDandelion) {
         
          let dandelionType;
          if (i < grassClumpCount + shrubCount + dandelionCount) {
            dandelionType = 1;
            positions.push({
              position: new THREE.Vector3(xPos, -0.8, zPos),
              rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
              scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1),
              type: dandelionType,
            });
          } else if (i < grassClumpCount + shrubCount + dandelionCount * 2) {
            dandelionType = 2;
            positions.push({
              position: new THREE.Vector3(xPos, -0.8, zPos),
              rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
              scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1),
              type: dandelionType,
            });
          } else {
            dandelionType = 3;
            positions.push({
              position: new THREE.Vector3(xPos, -0.8, zPos),
              rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
              scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1),
              type: dandelionType,
            });
          }
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
    }
    return { positions, pinePositions };
  }, [grassClumpCount, shrubCount, dandelionCount, pineCount]);

  const { positions: grassShrubDandelionPositions, pinePositions } = fieldPositions;
  console.log(grassShrubDandelionPositions)

  useFrame(() => {
    let grassIndex = 0;
    let shrubIndex = 0;
    let dandelionAIndex = 0;
    let dandelionBIndex = 0;
    let dandelionCIndex = 0;

    grassShrubDandelionPositions.forEach((data) => {
      dummy.position.copy(data.position);
      dummy.rotation.copy(data.rotation);
      dummy.scale.copy(data.scale);
      dummy.updateMatrix();
      // if(data.position.x < 1){
      //   console.log("hello world")
      // }
      

      switch (data.type) {
        case 'shrub':
          if (shrubRef.current) {
            shrubRef.current.setMatrixAt(shrubIndex++, dummy.matrix);
          }
          break;
        case 1:
          if (dandelionARef.current) {
            dandelionARef.current.setMatrixAt(dandelionAIndex++, dummy.matrix);
          }

          break;
        case 2:
          if (dandelionBRef.current) {
            dandelionBRef.current.setMatrixAt(dandelionBIndex++, dummy.matrix);
          }

          break;
        case 3:
          if (dandelionCRef.current) {
            dandelionCRef.current.setMatrixAt(dandelionCIndex++, dummy.matrix);
          }

          break;
        default:
          if (grassRef.current) {
            grassRef.current.setMatrixAt(grassIndex++, dummy.matrix);
          }
          break;
      }
    });

    if (grassRef.current) grassRef.current.instanceMatrix.needsUpdate = true;
    if (shrubRef.current) shrubRef.current.instanceMatrix.needsUpdate = true;
    if (dandelionARef.current) dandelionARef.current.instanceMatrix.needsUpdate = true;
    if (dandelionBRef.current) dandelionBRef.current.instanceMatrix.needsUpdate = true;
    if (dandelionCRef.current) dandelionCRef.current.instanceMatrix.needsUpdate = true;
  });

  const grassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      alphaMap: alphaTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
      alphaTest: 0,
      flatShading: true,
    });
  }, [diffuseTexture, alphaTexture]);

  return (
    <group>
      <instancedMesh ref={grassRef} args={[geometry, grassMaterial, grassClumpCount * grassPerClump]} />
      <instancedMesh ref={shrubRef} args={[shrubAGeometry, shrubAMaterial, shrubCount]} />
      <instancedMesh ref={dandelionARef} args={[dandelionAGeometry, dandelionAMaterial, dandelionCount]} />
      <instancedMesh ref={dandelionBRef} args={[dandelionBGeometry, dandelionBMaterial, dandelionCount]} />
      <instancedMesh ref={dandelionCRef} args={[dandelionCGeometry, dandelionCMaterial, dandelionCount]} />
      {pinePositions.map(({ position, rotation }, index) => (
        <Pine key={`pine-${index}`} position={position} rotation={rotation} />
      ))}
    </group>
  );
}
