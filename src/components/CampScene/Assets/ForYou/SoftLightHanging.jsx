/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 softLightHanging.glb 
*/

import React from 'react';
import { useGLTF } from '@react-three/drei';

export function SoftLightHanging(props) {
  const { nodes, materials } = useGLTF('/3D/softLightHanging.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.SoftLight_08001.geometry}
        material={materials['Material.002']}
        position={[0.311, 3.735, -0.238]}
        rotation={[Math.PI / 2, 0, 1.562]}
        scale={0.001}
      />
      <mesh
        geometry={nodes.SoftLight_08002.geometry}
        material={materials['Material.002']}
        position={[0.311, 4.189, -0.244]}
        rotation={[Math.PI / 2, 0, 1.562]}
        scale={0.001}
      />

      <group>
        <mesh
          geometry={nodes.SoftLight_08.geometry}
          material={materials.wire_115115115}
          position={[0.313, 3.43, -0.025]}
          rotation={[Math.PI / 2, 0, 1.562]}
          scale={0.001}
        />
        <mesh
          geometry={nodes.SoftLight_08003.geometry}
          material={materials['Material.002']}
          position={[0.31, 3.446, -0.097]}
          rotation={[Math.PI / 2, 0, 1.562]}
          scale={0.001}
        />
        <mesh
          geometry={nodes.SoftLight_08004.geometry}
          material={materials['Material.010']}
          position={[0.313, 3.418, 0.02]}
          rotation={[Math.PI / 2, 0, 1.562]}
          scale={0.001}
        />
        <mesh
          geometry={nodes.SoftLight_08005.geometry}
          material={materials['Material.002']}
          position={[0.314, 3.392, 0.118]}
          rotation={[Math.PI / 2, 0, 1.562]}
          scale={0.001}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/3D/softLightHanging.glb');
