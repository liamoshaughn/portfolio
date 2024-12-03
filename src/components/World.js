import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Preload } from '@react-three/drei';


import { useAnimationStore } from '../store/store';
import CameraAnimated from './AnimCamera';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import NightSky from './CampScene/NightSky/NightSky';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing'
import SceneForYou from './ForYouScene/SceneForYou';

const SceneCamp = lazy(() => import('./CampScene/SceneCamp'));

function Effects() {
  const bloomRef = useRef();
  const depthRef = useRef();
  const [initialTime, setInitialTime] = useState(0);

  const animationStore = useAnimationStore();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (bloomRef.current && depthRef.current) {
      if (animationStore.stage === 2) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 5) {
          bloomRef.current.intensity = 4 * ((time - initialTime) / 5);
          depthRef.current.bokehScale = 6 * ((time - initialTime) / 5);
        }
      }
    }
  });

  return (
    <EffectComposer>
      {/* <Bloom ref={bloomRef} kernelSize={1} intensity={0} luminanceThreshold={0.01} /> */}
      {/* <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.002} bokehScale={0} />
      <Vignette
        offset={0.4} // vignette offset
        darkness={0.7} // vignette darkness
        eskil={false} // Eskil's vignette technique
        blendFunction={BlendFunction.NORMAL}
      /> */}
    </EffectComposer>
  );
}

function World() {
  const store = useAnimationStore();

  useEffect(() => {
    console.log(store.stage);
  }, [store.stage]);

  return (
    <Canvas dpr={[0.5, 2]} gl={{ antialias: true }} shadows>
      <color attach="background" args={['white']} />
      <PerspectiveCamera
            position={[1, 0.15, 2]}
            rotation={[0, 0, 0]}
            fov={70}
            makeDefault
          />
      <group position={[0,0,0]}>
        {/* <Preload all /> */}

        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color={new THREE.Color('rgb(210, 210, 210)')} />
        </mesh>
        {/* <CameraAnimated /> */}
        <group position={[0,0,1000]}>
        {/* <Suspense fallback={null}>
          <SceneCamp />
        </Suspense> */}
        <NightSky />
 
        </group>         
        
        <Suspense fallback={null}>
            <SceneForYou/>
          </Suspense>
        <Effects />
        <Environment files={'autoshop.exr'} backgroundBlurriness={0.8} background />
        {/* <hemisphereLight intensity={0.5} /> */}
        {/* <OrbitControls/> */}
      </group>
    </Canvas>
  );
}

export default World;
