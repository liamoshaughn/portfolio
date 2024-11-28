import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera } from '@react-three/drei';

import SceneCamp from './components/CampScene/SceneCamp';
import StatsComponent from './components/Stats';
import NightSky from './components/NightSky';


function CameraLogger() {
  const { camera } = useThree();
  // useFrame(()=>{
  //   console.log('Camera Position:', camera.position);
  //   console.log('Camera Rotation:', camera.rotation);
  //   console.log('Camera', camera)
  // })


  return null; // This component doesn't render anything visually
}

function App() {
{/* <OrbitControls/> */}
  return (
    <div style={{ height: '100vh', background:'black' }}>
      <Canvas shadows>
      <PerspectiveCamera makeDefault position={[-7.435484847921432, 1.283630264703918, 2.803298358553767]} rotation={[-0.3497735397233472, -1.352775510204316, -0.3421314080622057]}fov={40} />
            <NightSky/>
      <SceneCamp/>
      </Canvas>

      <StatsComponent />
    </div>
  );
}

export default App;
