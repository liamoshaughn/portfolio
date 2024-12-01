import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Campfire from './Campfire/Campfire';
import 'three-hex-tiling';
import Field from './Field';
import { useFrame, useLoader } from '@react-three/fiber';
import { useAnimationStore } from '../../store/store';
import { Spacesuit } from './Assets/Spacesuit';
import { LongLog } from './Assets/LongLogBig';

import FirefliesInstanced from './Firefly';
import { useProgress } from '@react-three/drei';

function GroundPlane() {
  const planeRef = useRef();

  // Load textures for the ground
  const [groundNormalMap, groundRoughnessMap, groundAlphaMap] = useLoader(THREE.TextureLoader, [
    '/3D/textures/rocks_ground_nor.jpg',
    '/3D/textures/rocks_ground_rough.jpg',
    '/3D/textures/rocks_ground_alpha.jpg',
  ]);

  useEffect(() => {
    // Compute vertex normals for better lighting/shading
    if (planeRef.current) {
      planeRef.current.geometry.computeVertexNormals();

    }
  }, []);

  return (
    <mesh ref={planeRef} position={[0, -40.685, 0]} rotation={[Math.PI, 0, Math.PI]} receiveShadow>
      <sphereGeometry args={[40, 64, 32,0, Math.PI*2, 0 ,0.1]} />
      <meshStandardMaterial
        color={new THREE.Color('rgb(120, 68, 11)')}
        normalMap={groundNormalMap}
        roughnessMap={groundRoughnessMap}
        alphaMap={groundAlphaMap}
        transparent={true}
        roughness={1}
        normalScale={new THREE.Vector2(0.2, 0.2)}
      />
    </mesh>
  );
}


function ForestPlane() {
  const [forestDisplacementMap, forestNormalMap, forestRoughnessMap, forestDiffuseMap] = useLoader(
    THREE.TextureLoader,
    [
      '/3D/textures/forest_ground_disp.jpg',
      '/3D/textures/forest_ground_nor.jpg',
      '/3D/textures/forest_ground_rough.jpg',
      '/3D/textures/forest_ground_diff.jpg',
    ]
  );

  [forestDisplacementMap, forestNormalMap, forestRoughnessMap, forestDiffuseMap].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(130, 130); // Adjust the repeat value as needed
  });
  return (
    <group>
      <mesh position={[0, -40.68, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
        <sphereGeometry args={[40, 128, 64, 0, Math.PI*2 ]} />
        <meshStandardMaterial
          color={new THREE.Color('rgb(120, 68, 11)')}
          roughness={1}
          normalMap={forestNormalMap}
          normalScale={0.2}
          hexTiling={{
            patchScale: 5,
            useContrastCorrectedBlending: true,
            lookupSkipThreshold: 0.01,
            textureSampleCoefficientExponent: 8,
          }}
        />
      </mesh>
    </group>
  );
}

function SceneCamp() {
  // const planeRef = useRef();
  const lightRef = useRef({ value: 1.0 });
  const store = useAnimationStore()
  



  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (lightRef.current) {
      const sineFunction = 0.5 * Math.sin(3 * time * 2) + 0.3 * Math.sin(7 * time) + 0.2 * Math.cos(5 * time * 3);

      const flicker = Math.abs(sineFunction) * 0.2 + 0.5;
      lightRef.current.value = flicker * 2;
    }
  });

  return (
    <group>
      {/* <Environment preset={'forest'}/> */}
      {/* <spotLight castShadow rotation={[0,Math.PI, 0]} position={[0,4,0]} intensity={100}/> */}
      {/* <directionalLight position={[5, 5, 5]} intensity={10} color={new THREE.Color(0xaaaaaa)} castShadow /> */}
      {/* <Campfire lightRef={lightRef} scale={[0.7 , 0.7 ,0.7]} position={[-1, -0.22 , 1]} />
      <Field lightRef={lightRef} />
      <Spacesuit rotation={[0, 0.5, 0]} position={[1, -0.7, 2.4]} /> */}
      <Campfire lightRef={lightRef} />
      <Field lightRef={lightRef} />
      <Spacesuit rotation={[0, 0.4, 0]} position={[1, -0.7, 3]} />
      <GroundPlane />
      <ForestPlane />
      <FirefliesInstanced />
  
    </group>
  );
}

export default SceneCamp;
