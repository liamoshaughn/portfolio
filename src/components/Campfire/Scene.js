import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import Campfire from './Campfire';
import { Tree } from './Assets/Tree';
import 'three-hex-tiling';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

function SceneCamp() {
  const colorTexture = useLoader(THREE.TextureLoader, '/3D/textures/GroundColor.jpg');
  const aoTexture = useLoader(THREE.TextureLoader, '/3D/textures/Ground_AmbientOcclusion.jpg');
  const roughTexture = useLoader(THREE.TextureLoader, '/3D/textures/Ground_Roughness.jpg');
  const normalTexture = useLoader(THREE.TextureLoader, '/3D/textures/Ground_NormalGL.jpg');
  const displacementTexture = useLoader(THREE.TextureLoader, '/3D/textures/Ground_Displacement.jpg');

  [colorTexture, aoTexture, roughTexture, normalTexture, displacementTexture].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);
  });

  const planeRef = useRef();



  return (
    <group>
      {/* <Environment preset={'forest'}/> */}
      <Tree position={[30, -1, 0]} castShadow={true} />
      <Tree position={[29, -1, 10]} castShadow={true} />
      <Tree position={[40, -1, 10]} castShadow={true}/>
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.1} // Lower intensity for soft moonlight
        color={new THREE.Color(0xaaaaaa)} // Pale white-blue color for moonlight
        castShadow
      />

      <Campfire />



      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow={false} receiveShadow={true}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial
          map={colorTexture}
          aoMap={aoTexture}
          aoMapIntensity={2}
          roughnessMap={roughTexture}
          displacementMap={displacementTexture}
          displacementScale={1}
          hexTiling={{
            patchScale: 3,
            useContrastCorrectedBlending: true,
            lookupSkipThreshold: 0.01,
            textureSampleCoefficientExponent: 8,
          }}
        />
      </mesh>

      {/* <EffectComposer>
          <Bloom intensity={10} luminanceThreshold={10}  height={300} />
        </EffectComposer> */}
    </group>
  );
}

export default SceneCamp;
