import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import {useSpring, animated} from '@react-spring/three'
import SceneCamp from './components/CampScene/SceneCamp';
import StatsComponent from './components/Stats';
import NightSky from './components/NightSky';
import { useAnimationStore } from './store/store';
import CameraAnimated from './components/AnimCamera';

function CameraLogger() {
  const { camera } = useThree();

  useFrame(()=>{
    console.log('Camera', camera)
  })

  return null; // This component doesn't render anything visually
}


function App() {
  const cameraRef = useRef()
  const store = useAnimationStore()


  const handleClick =() =>{
    console.log("click")
    store.increment()
  }

  useEffect(()=>{
    console.log(store.stage)
  },[store.stage])



  return (
    <div style={{ height: '100vh', background: 'black' }}>
      <Canvas shadows>
        <CameraAnimated/>
        <NightSky />
        <SceneCamp />
      </Canvas>
      <button onClick={()=>handleClick()} style={{position: 'absolute', bottom:'10vh'}}>Press</button>
      <StatsComponent />
    </div>
  );
}

export default App;
