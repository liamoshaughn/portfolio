import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Campfire from './Campfire/Campfire';
import 'three-hex-tiling';
import Field from './Field';
import { useFrame, useLoader } from '@react-three/fiber';
import { useAnimationStore } from '../../store/store';
import { Spacesuit } from './Assets/Spacesuit';
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';
import FirefliesInstanced from './Firefly';

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
    <mesh ref={planeRef} position={[0, -0.685, 0]} rotation={[-Math.PI / 2, 0, 3.5]} receiveShadow>
      <circleGeometry args={[8, 2046]} />
      <meshStandardMaterial
        color={new THREE.Color('rgb(120, 68, 11)')}
        normalMap={groundNormalMap}
        roughnessMap={groundRoughnessMap}
        alphaMap={groundAlphaMap}
        transparent={true}
        roughness={1}
        normalScale={0.2}
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
    texture.repeat.set(30, 30); // Adjust the repeat value as needed
  });
  return (
    <group>
      <mesh position={[0, -0.69, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={new THREE.Color('rgb(120, 68, 11)')}
          roughness={1}
          normalMap={forestNormalMap}
          normalScale={0.2}
          hexTiling={{
            // default values shown
            patchScale: 3,
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
  const bloomRef = useRef();
  const depthRef = useRef();
  const [initialTime, setInitialTime] = useState(0);
  const animationStore = useAnimationStore();
  const stageSettings = [
    { intensity: 0, bokehScale: 0 },
    { intensity: 3.0, bokehScale: 4 },
  ];
  

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (bloomRef.current && depthRef.current) {
      if (animationStore.stage === 1) {
        if (initialTime === 0) {
          setInitialTime(time);
        }
        else if (time - initialTime <= 5 ) {
        bloomRef.current.intensity = 3 * ( (time-initialTime)/5)
        depthRef.current.bokehScale = 4 * ( (time-initialTime)/5)
        }
      }
    }
    if (lightRef.current) {
      const sineFunction = 0.5 * Math.sin(3 * time * 2) + 0.3 * Math.sin(7 * time) + 0.2 * Math.cos(5 * time * 3);

      const flicker = Math.abs(sineFunction) * 0.2 + 0.5;
      lightRef.current.value = flicker * 2;
    }
  });

  useEffect(() => {}, [animationStore.stage]);
  return (
    <group>
      {/* <Environment preset={'forest'}/> */}
      {/* <spotLight castShadow rotation={[0,Math.PI, 0]} position={[0,4,0]} intensity={100}/> */}
      {/* <directionalLight position={[5, 5, 5]} intensity={10} color={new THREE.Color(0xaaaaaa)} castShadow /> */}

      <Campfire lightRef={lightRef} />
      <Field lightRef={lightRef} />
      <Spacesuit rotation={[0, 0.4, 0]} position={[1, -0.7, 3]} />
      <GroundPlane />
      <ForestPlane />
      <FirefliesInstanced />
      <EffectComposer>
        <Bloom ref={bloomRef} intensity={0} luminanceThreshold={0.01} />
        <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.003} bokehScale={0} />
      </EffectComposer>
    </group>
  );
}

export default SceneCamp;
