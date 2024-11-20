import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {  useControls } from 'leva'; // For UI controls
import FireLog from './FireLog';
import * as THREE from 'three';


export default function Campfire() {

  const fireLightRef = useRef();


  // const { fireRotationX, firePositionY, firePositionZ } = useControls({
  //   fireRotationX: { value: -2.71, min: -Math.PI, max: Math.PI, step: 0.01 },
  //   firePositionY: { value: 0, min: -3, max: 3, step: 0.01 },
  //   firePositionZ: { value: 0, min: -3, max: 3, step: 0.01 }
  // });



  useFrame(({ clock }) => {
    if (fireLightRef.current) {
      const time = fireLightRef.current.randomSeed + clock.getElapsedTime() *2;
      const sineFunction =
        Math.sin(time) * Math.sin(time) +
        Math.sin(2 * time) -
        Math.cos(time) * Math.sin((3 * time) / 2);

      const flicker = Math.abs(sineFunction) * 0.2 + 0.5;
      fireLightRef.current.intensity = flicker * 1;
    }
  });

  return (
    <group>
       <pointLight
          position={[0, 0, 0]}
          intensity={1}
          color={new THREE.Color('#fefa9b')}
          decay={0.1}
          distance={50}
          castShadow={true}
          power={90}
          randomSeed = {Math.random()}
        /> 
        {/* <pointLight
          ref={fireLightRef}
          position={[0, 0, 0]}
          intensity={2}
          color={new THREE.Color('#fefa9b')}
          decay={0.1}
          distance={10}
          power={70}
          castShadow={true}
          randomSeed = {Math.random()}
        />  */}
      <FireLog
        rotation={[-0.5, 0, 0]}
        position={[0, 0 ,0]}
        logScale={[1, 0.5, 1]}
        clip={{x: 0, y:-0.2, z:0.8}}
        fireRotation={[-2.71, 0 , 0]}
        firePosition= {[0, 0.49, -0.13 ]}
      />
      <FireLog
        rotation={[-1.5, -0.4, -1.1]}
        position={[0.05, -0.24 , -0.3]}
        logScale={[1, 0.5, 1]}
        clip={{x: 0, y:0, z:0}}
        fireRotation={[-1.9, 0 , 0]}
        firePosition= {[0, 0.20, 0.34 ]}
      />
      <FireLog
        rotation={[-1.53, -0.2, 0.35]}
        position={[0.32, -0.65 , -0.4]}
        logScale={[1, 0.5, 1]}
        clip={{x: 0, y:0, z:0}}
        fireRotation={[-1.6, 0 , 0]}
        firePosition= {[0, 0.08, 0.50 ]}
      />
      <FireLog
        rotation={[1.33, -2.39, 1.07]}
        position={[0.06, 0 , -0.58]}
        logScale={[0.6, 0.6, 0.6]}
        clip={{x: 0, y:-0.5, z:1}}
        fireRotation={[-2.34, 0 , 0]}
        firePosition= {[0, 0.5, 0.01 ]}
      />
      <FireLog
        rotation={[-2.15, 0.55, 2.31]}
        position={[0.15, 0.01, -0.92]}
        logScale={[1, 0.5, 1]}
        clip={{x: 0, y:-0.2, z:0.8}}
        fireRotation={[-2.2, 0 , 0]}
        firePosition= {[0, 0.43, 0.09 ]}
      />
      <FireLog
        rotation={[-0.86, 0.78, 0.77]}
        position={[0.66, -0.09, -0.22]}
        logScale={[0.8, 0.4, 0.8]}
        clip={{x: 0, y:-0.2, z:0.8}}
        fireRotation={[-2.5, 0 , 0]}
        firePosition= {[0, 0.32, -0.07 ]}
      />
    </group>
  );
}
