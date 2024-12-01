import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Preload, useProgress } from '@react-three/drei';
import StatsComponent from './utils/Stats';

import { useAnimationStore, useUtilityStore } from './store/store';
import CameraAnimated from './components/AnimCamera';
import { Bloom, DepthOfField, EffectComposer, KernelSize } from '@react-three/postprocessing';
import SpeedTest from './utils/SpeedTest';
import NightSky from './components/CampScene/NightSky/NightSky';

const SceneCamp = lazy(() => import('./components/CampScene/SceneCamp'));

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
          depthRef.current.bokehScale = 4 * ((time - initialTime) / 5);
        }
      }
    }
  });

  return (
    <EffectComposer>
      <Bloom ref={bloomRef} kernelSize={1} intensity={0} luminanceThreshold={0.01} />
      <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.003} bokehScale={0} />
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
    <Canvas shadows>
      <Preload all />
      <CameraAnimated />
        <Suspense fallback={null}>
          <SceneCamp />
        </Suspense>

      <NightSky />
      <Effects />
      {/* <directionalLight intensity={10}/>
      <OrbitControls/> */}
    </Canvas>
  );
}

export default World;
