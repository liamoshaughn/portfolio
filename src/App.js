import React from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls } from '@react-three/drei';

import SceneCamp from './components/Scene';
import StatsComponent from './components/Stats';


function App() {
  return (
    <div style={{ height: '100vh', background:'black' }}>
      <Canvas shadows={"basic"}>
        <OrbitControls />
        <SceneCamp/>
      </Canvas>
      <StatsComponent />
    </div>
  );
}

export default App;
