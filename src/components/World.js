import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Preload, useProgress } from '@react-three/drei';
import StatsComponent from '../utils/Stats';

import { useAnimationStore, useUtilityStore } from '../store/store';
import CameraAnimated from './AnimCamera';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import SpeedTest from '../utils/SpeedTest';
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
      <Bloom ref={bloomRef} kernelSize={1} intensity={0} luminanceThreshold={0.01} />
      <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.002} bokehScale={0} />
      <Vignette
        offset={0.4} // vignette offset
        darkness={0.7} // vignette darkness
        eskil={false} // Eskil's vignette technique
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

function World() {
  const store = useAnimationStore();
  const { estimatedLoadTime } = useUtilityStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log(store.stage);
  }, [store.stage]);

  return (
    <Canvas dpr={[0.5, 2]} gl={{ antialias: true }} shadows>
      {/* <Preload all /> */}
      {/* <PerspectiveCamera
          position={[-6.435484847921432, 1.283630264703918, 2.803298358553767]}
          rotation={[-0.3497735397233472, -1.352775510204316, -0.3421314080622057]}
          fov={70}
          makeDefault
        /> */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color={new THREE.Color('rgb(255, 255, 255)')} />
      </mesh>
      <CameraAnimated />
      <Suspense fallback={null}>
        <SceneCamp />
      </Suspense>
        <Suspense fallback={null}>
          <SceneForYou/>
        </Suspense>
      <NightSky />
      <Effects />
      {/* <directionalLight intensity={10}/> */}
      {/* <OrbitControls/> */}
    </Canvas>
  );
}

export default World;
