import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva'; // For UI controls
import FireLog from './FireLog';
import * as THREE from 'three';
import { RockA, RockB } from '../Assets/Rocks';
import SmokeShader from './Smoke';
import EmberShader from './FireParticle';
import { useAnimationStore } from '../../../store/store';
import { useSpring, config, a } from '@react-spring/three';

export default function Campfire(props) {
  const fireLightRef = useRef();
  const fireLightRef2 = useRef();
  const planeRef = useRef();
  const animationStore = useAnimationStore();


  // const { fireRotationX, firePositionY, firePositionZ } = useControls({
  //   fireRotationX: { value: -2.71, min: -Math.PI, max: Math.PI, step: 0.01 },
  //   firePositionY: { value: 0, min: -3, max: 3, step: 0.01 },
  //   firePositionZ: { value: 0, min: -3, max: 3, step: 0.01 }
  // });

  const rockCount = 15;
  const radius = 1.5;

  const { scale } = useSpring({
    scale: animationStore.stage === 2 ? 0.7 : 5,
    config: {
      mass: 1,     
      tension: 70, 
      friction: 14, 
    }, 
  });
 

  useFrame(({clock}) => {
    if (fireLightRef.current && props.lightRef.current) {
      const flickerIntensity = props.lightRef.current.value;
      fireLightRef.current.power= flickerIntensity*40;
      console.log(flickerIntensity*100)
      // fireLightRef.current.shadow.map.needsUpdate = true;
      // console.log(fireLightRef.current)
    }
  });

  
  const [coralNormalMap, coralRoughnessMap, coralDiffuse, coralDisp] = useLoader(THREE.TextureLoader, [
    '/3D/textures/coral_wall_nor.jpg',
    '/3D/textures/coral_wall_rough.jpg',
    '/3D/textures/coral_wall_diff.jpg',
    '/3D/textures/coral_wall_disp.jpg',
  ]);

  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.geometry.computeVertexNormals();
    }
  }, []);

  return (
    <group>
      <a.pointLight
        ref={fireLightRef}
        position={[0, 1, 0]}
        color={new THREE.Color(1, 0.654, 0.345)}
        decay={scale}
        distance={50}
        castShadow
        randomSeed={Math.random()}
      />
      <group position={[0,-0.2,0]} scale={.7}>
      <mesh ref={planeRef} position={[0.2, -0.68, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 2046]} />
        <meshStandardMaterial
          map ={coralDiffuse}
          normalMap={coralNormalMap}
          displacementMap={coralDisp}
          displacementScale={0.2}
          roughness={1}
          normalScale={2}
        />
      </mesh>
      <group position={[0,0.15,0]}>
        <SmokeShader/>
        <group position={[-0.2,0,-0.2]}>
        <EmberShader/>
        </group>
        <FireLog
          rotation={[-0.5, 0, 0]}
          position={[0, 0, 0]}
          logScale={[1, 0.5, 1]}
          clip={{ x: 0, y: -0.2, z: 0.8 }}
          fireRotation={[-2.71, 0, 0]}
          firePosition={[0, 0.49, -0.13]}
        />
        <FireLog
          rotation={[-1.5, -0.4, -1.1]}
          position={[0.05, -0.24, -0.3]}
          logScale={[1, 0.5, 1]}
          clip={{ x: 0, y: 0, z: 0 }}
          fireRotation={[-1.9, 0, 0]}
          firePosition={[0, 0.2, 0.34]}
        />
        <FireLog
          rotation={[-1.53, -0.2, 0.35]}
          position={[0.32, -0.65, -0.4]}
          logScale={[1, 0.5, 1]}
          clip={{ x: 0, y: 0, z: 0 }}
          fireRotation={[-1.6, 0, 0]}
          firePosition={[0, 0.08, 0.5]}
        />
        <FireLog
          rotation={[1.33, -2.39, 1.07]}
          position={[0.06, 0, -0.58]}
          logScale={[0.6, 0.6, 0.6]}
          clip={{ x: 0, y: -0.5, z: 1 }}
          fireRotation={[-2.34, 0, 0]}
          firePosition={[0, 0.5, 0.01]}
        />
        <FireLog
          rotation={[-2.15, 0.55, 2.31]}
          position={[0.15, 0.01, -0.92]}
          logScale={[1, 0.5, 1]}
          clip={{ x: 0, y: -0.2, z: 0.8 }}
          fireRotation={[-2.2, 0, -0.3]}
          firePosition={[0, 0.43, 0.09]}
        />
        <FireLog
          rotation={[-0.86, 0.78, 0.77]}
          position={[0.66, -0.09, -0.22]}
          logScale={[0.8, 0.4, 0.8]}
          clip={{ x: 0, y: -0.2, z: 0.8 }}
          fireRotation={[-2.5, 0, 0]}
          firePosition={[0, 0.32, -0.07]}
        />
      </group>
      <group position={[0.2, 0, -0.4]}>
        {Array.from({ length: rockCount }).map((_, index) => {
          const angle = (index / rockCount) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          // Alternate between RockA and RocksB
          const RockComponent = index % 2 === 0 ? RockA : RockB;

          return (
            <RockComponent key={index} position={[x, -0.7, z]} rotation={[0, angle + 0.3, 0]} scale={[1.7, 1.7, 1.7]} />
          );
        })}
      </group>
      </group>
    </group>
  );
}
