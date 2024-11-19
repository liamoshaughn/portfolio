import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer} from '@react-three/postprocessing';
import * as THREE from 'three';
import Campfire from './components/Campfire/Campfire';

function App() {
  return (
    <div style={{ height: '100vh', background:'black' }}>
      <Canvas shadows={true}>
        {/* <Environment preset={'forest'}/> */}
    
        <OrbitControls />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} // Lower intensity for soft moonlight
          color={new THREE.Color(0xaaaaaa)} // Pale white-blue color for moonlight
          castShadow
        />
        
        <Campfire />

        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color={new THREE.Color('rgb(120, 68, 11)')} />
        </mesh>

        {/* <EffectComposer>
          <Bloom intensity={40} luminanceThreshold={1}  height={300} />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
}

export default App;
