import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Campfire from './Campfire/Campfire';
import 'three-hex-tiling';
import Field from './Field';
import { useFrame, useLoader } from '@react-three/fiber';
import { Spacesuit } from '../Assets/Camp/Spacesuit';
import { useAnimationStore } from '../../store/store';
import { useLenis } from 'lenis/react';
import { useThree } from '@react-three/fiber';
import FirefliesInstanced from './Firefly';
import * as d3Ease from 'd3-ease'; 

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
      <circleGeometry args={[8, 128]} />
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

function SceneCamp(props) {
  const lightRef = useRef({ value: 1.0 });
  const [isMobile, setIsMobile] = useState(false); 
  const store = useAnimationStore()
  const three = useThree()


  useEffect(() => {
    const checkIfMobile = () => {
      // Method 1: Using screen dimensions and ratio
      const ratio = window.devicePixelRatio || 1;
      const screenWidth = window.screen.width * ratio;
      
      // Method 2: Alternative approach combining multiple factors
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const calculatedWidth = Math.min(window.innerWidth, window.screen.width);
      
      // Combine checks for better reliability
      setIsMobile(
        (calculatedWidth <= 768) || 
        (screenWidth <= 768) || 
        (isTouchDevice && calculatedWidth <= 1024)
      );
    };
  
    // Initial check
    checkIfMobile();
  
    // Event listener for resize
    window.addEventListener('resize', checkIfMobile);
  
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lightRef.current) {
      const sineFunction = 0.5 * Math.sin(3 * time * 2) + 0.3 * Math.sin(7 * time) + 0.2 * Math.cos(5 * time * 3);
      const flicker = Math.abs(sineFunction) * 0.2 + 0.5;
      lightRef.current.value = flicker * 2;
    }
  });
  useLenis(
    ({ scroll }) => {
      const offset = (scroll / 6000);
      const easedProgress = d3Ease.easeCircleOut(offset)
      if(store.stage === 5){
        if (offset > 0) {
          if (offset <= 1) {
            three.camera.position.set(-7.435 + 1 * easedProgress, 1110 - 1108.717 * easedProgress, 1002.803);
            three.camera.rotation.set(-0.349, -1.352, -0.342);
            three.camera.fov = 70 - 30 * easedProgress;
            three.camera.updateProjectionMatrix();
          }
        }
      }
    },
    [store.stage]
  );
  

  const campfirePosition = isMobile ? [-0.9, -0.28, 1.5] : [0, 0, 0]; 
  const spacesuitPosition = isMobile ? [0.5, -0.7, 2] : [1, -0.7, 3]; 
  const campfireScale = isMobile ? 0.6 : 1

  return (
    <group {...props}>
      <Campfire lightRef={lightRef} scale={campfireScale} position={campfirePosition} />
      <Field lightRef={lightRef} />
      <Spacesuit rotation={[0, 0.4, 0]} position={spacesuitPosition} />
      <GroundPlane />
      {/* <ForestPlane /> */}
      <FirefliesInstanced />
    </group>
  );
}

export default SceneCamp;
