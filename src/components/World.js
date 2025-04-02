import React, { useRef, useEffect, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  PerformanceMonitor,
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  ScrollControls,
} from '@react-three/drei';

import { useAnimationStore } from '../store/store';
import CameraAnimated from './AnimCamera';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';
import NightSky from './CampScene/NightSky/NightSky';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';
import { useLenis } from 'lenis/react';

const SceneCamp = lazy(() => import('./CampScene/SceneCamp'));
const SceneForYou = lazy(() => import('./ForYouScene/SceneForYou'));

function Effects({ regress }) {
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

  let framesCount = 0;
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if(three.camera.position.z === 2){
      framesCount++
    } else {
      framesCount = 0
    }
    if (animationStore.stage === 3 && !animationStore.moving && framesCount>5) {
      animationStore.setDisableCamera(true);
      animationStore.setMoving(false);
    }
    if (vigRef.current && bloomRef.current && depthRef.current) {
      if (animationStore.stage === 2) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 5) {
          bloomRef.current.intensity = 4 * ((time - initialTime) / 5);
          depthRef.current.bokehScale = 4 * ((time - initialTime) / 5);
        }
      }
      if (animationStore.stage === 3 && !animationStore.disableCamera) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 5) {
          bloomRef.current.intensity = 4 - 4 * ((time - initialTime) / 5);
          depthRef.current.bokehScale = 4 - 4 * ((time - initialTime) / 5);
          vigRef.current.darkness = 0.7 - 0.2 * ((time - initialTime) / 5);
          setIntensity(1 * ((time - initialTime) / 5));
        }
      }
    }
  });

  useLenis(
    ({ scroll }) => {
      if (
        (animationStore.stage === 3 && scroll > 6000 + window.innerHeight) ||
        (animationStore.stage === 5 && scroll <= window.innerHeight * 0.01)
      ) {
        if (animationStore.stage !== 4) {
          animationStore.setStage(4);
          three.camera.position.set(-7.435, 1110, 1002.803);
          three.camera.rotation.set(-0.349, -1.352, -0.342);
          setIntensity(0);
        }
      } else if (animationStore.stage === 4 && scroll < 6000 + window.innerHeight && scroll > window.innerHeight) {
        if (animationStore.stage !== 3) {
          three.camera.position.set(1, 0.15, 2);
          three.camera.rotation.set(0, 0, 0);
          animationStore.setStage(3);
          setIntensity(1);
        }
      } else if (animationStore.stage === 4 && scroll < window.innerHeight && scroll > window.innerHeight * 0.01) {
        animationStore.setStage(5);
      }
    },
    [animationStore.stage]
  );

  useFrame((state) => {
    if (regress) {
      state.performance.regress();
    }
  });

  return (
    <group>
      <Environment
        backgroundIntensity={intensity}
        environmentIntensity={intensity * 0.5}
        files={'autoshop.exr'}
        backgroundBlurriness={0.8}
        background
      />
      <EffectComposer multisampling={0} resolution={0.5} disableNormalPass>
        <Bloom ref={bloomRef} kernelSize={3} intensity={0} luminanceThreshold={0.02} />
        <DepthOfField ref={depthRef} focusDistance={0.0085} focalLength={0.002} bokehScale={0} />
        <Vignette ref={vigRef} scroll={0.4} darkness={0.7} eskil={false} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </group>
  );
}

function World() {
  const store = useAnimationStore();
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    console.log('Current Stage:', store.stage);
  }, [store.stage]);
  useEffect(() => {
    console.log('dpr', dpr);
  }, [dpr]);
  useEffect(() => {
    if (store.moving) {
      setDpr(0.7);
    } else {
      setDpr(1.5);
    }
  }, [store.moving]);
  return (
    <Canvas dpr={dpr} gl={{ antialias: false }} shadows>
      <PerformanceMonitor
        bounds={() => [24, 60]}
        // onChange={({ factor }) => (!store.moving ? setDpr(1 + factor) : null)}
      >
        {/* <AdaptiveDpr pixelated /> */}
        <AdaptiveEvents />
        <group position={[0, 0, 0]}>
          {!store.disableCamera && <CameraAnimated />}
          {store.stage !== 4 && <group>
            <Suspense fallback={null}>
              <group position={[0, 0, 1000]}>
                <SceneCamp />
              </group>
              <SceneForYou />
            </Suspense>
            <group position={[0, 0, 1000]}>
              <NightSky />
            </group>
          </group>}
          <Effects />
        </group>
      </PerformanceMonitor>
      {/* <ambientLight/> */}
      {/* <OrbitControls/> */}
    </Canvas>
  );
}

export default World;
