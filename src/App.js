import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer} from '@react-three/postprocessing';
import * as THREE from 'three';
import Campfire from './components/Campfire/Campfire';
import SceneCamp from './components/Scene';


function App() {
  return (
    <div style={{ height: '100vh', background:'black' }}>
      <Canvas shadows={"basic"}>
        <OrbitControls />
        <SceneCamp/>
      </Canvas>
    </div>
  );
}

export default App;
