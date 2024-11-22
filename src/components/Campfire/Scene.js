import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import Campfire from './Campfire';
import { Tree } from './Assets/Tree';
import 'three-hex-tiling';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { Pine } from './Assets/PineTree';
import Grass from '../Grass/Grass';
import { ShrubA } from './Assets/Shrub';

function SceneCamp() {


  const planeRef = useRef();



  return (
    <group>
      {/* <Environment preset={'forest'}/> */}

      <directionalLight
        position={[5, 5, 5]}
        intensity={0.1} 
        color={new THREE.Color(0xaaaaaa)} 
        castShadow
      />
      

      <Campfire />
      <Grass />



      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow={false} receiveShadow={true}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial
          color={new THREE.Color('rgb(120, 68, 11)')}
          roughness={1}
        />
      </mesh>

      {/* <EffectComposer>
          <Bloom intensity={10} luminanceThreshold={10}  height={300} />
        </EffectComposer> */}
    </group>
  );
}

export default SceneCamp;
