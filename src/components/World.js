import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, OrbitControls, PerspectiveCamera, Preload, ScrollControls } from '@react-three/drei';

import { useAnimationStore } from '../store/store';
import CameraAnimated from './AnimCamera';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import NightSky from './CampScene/NightSky/NightSky';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';
import { useLenis } from 'lenis/react';

const SceneCamp = lazy(() => import('./CampScene/SceneCamp'));
const  SceneForYou = lazy(() => import('./ForYouScene/SceneForYou'));

function Effects() {
  const bloomRef = useRef();
  const depthRef = useRef();
  const vigRef = useRef();
  const three = useThree();

  const [initialTime, setInitialTime] = useState(0);
  const [intensity, setIntensity] = useState(0);

  const animationStore = useAnimationStore();
  useEffect(() => {
    setInitialTime(0);
  }, [animationStore.stage]);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (vigRef.current && bloomRef.current && depthRef.current) {
      if (animationStore.stage === 2) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 5) {
          bloomRef.current.intensity = 4 * ((time - initialTime) / 5);
          depthRef.current.bokehScale = 6 * ((time - initialTime) / 5);
        }
      }
      if (animationStore.stage === 3) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 5) {
          bloomRef.current.intensity = 4 - 4 * ((time - initialTime) / 5);
          depthRef.current.bokehScale = 6 - 6 * ((time - initialTime) / 5);
          vigRef.current.darkness = 0.7 - 0.2 * ((time - initialTime) / 5);
          setIntensity(1 * ((time - initialTime) / 5));
        }
      }
    }
  });

  useLenis(
    ({ scroll }) => {
  
        if (scroll > 3000 + window.innerHeight) {
          three.camera.position.set(-7.435484847921432, 310, 1002.803298358553767);
          three.camera.rotation.set(-0.3497735397233472, -1.352775510204316, -0.3421314080622057);
        }
    }
  );


  return (
    <group>
      <Environment
        backgroundIntensity={intensity}
        environmentIntensity={intensity*0.5}
        files={'autoshop.exr'}
        backgroundBlurriness={0.8}
        background
      />
      <EffectComposer  >
        <Bloom ref={bloomRef} kernelSize={1} intensity={0} luminanceThreshold={0.01} />
        <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.002} bokehScale={0} />
        <Vignette
          ref={vigRef}
          scroll={0.4} 
          darkness={0.7}
          eskil={false} 
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </group>
  );
}

function World() {
 


  // useEffect(() => {
  //   console.log(store.moving);
  // }, [store.moving]);



  return (
    <Canvas dpr={[1, 2.5]} gl={{ antialias: false }} shadows>
      <AdaptiveDpr pixelated />
      <group position={[0, 0, 0]}>
        {/* <Preload all /> */}

        <CameraAnimated />
              {/* <PerspectiveCamera
            position={[18, 10, 7]}
            rotation={[-1.3, 1.1, 1.2]}
            fov={70}
            makeDefault
          /> */}
        <Suspense fallback={null}>
          <group position={[0, 0, 1000]}>
            <SceneCamp />
          </group>
             {/* <SceneForYou /> */}
       
        </Suspense>
        <Effects />
        <group position={[0, 0, 1000]}>
          <NightSky />
        </group>
        {/* <ambientLight intensity={0.5} /> */}
        {/* <OrbitControls/> */}
      </group>
    </Canvas>
  );
}

export default World;
