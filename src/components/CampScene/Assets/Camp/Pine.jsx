/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 pine.glb 
*/

import React, { useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';


export function Pine(props) {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF('/3D/pine-transformed.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action.play();
      });
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
        receiveShadow 
          name="Circle001_Bark_0"
          geometry={nodes.Circle001_Bark_0.geometry}
          material={materials.pine_tree_01_bark}
          position={[0.114, -0.02, 0.003]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, 1, 1.398]}
        />
        <mesh
          name="Plane010_Branches_0"
          geometry={nodes.Plane010_Branches_0.geometry}
          material={materials.Branches}
          position={[0.067, 18.336, -0.108]}
          rotation={[-1.47, 0.528, -0.293]}
          scale={[2.674, 1.612, 2.775]}
        />
        <group name="RootNode" scale={0.01}>
          <group name="Plane001" scale={100}>
            <mesh
              name="Plane001_Branches_0"
              geometry={nodes.Plane001_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane001_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane001_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane002" scale={100}>
            <mesh
              name="Plane002_Branches_0"
              geometry={nodes.Plane002_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane002_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane002_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane003" scale={100}>
            <mesh
              name="Plane003_Branches_0"
              geometry={nodes.Plane003_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane003_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane003_Branches_0.morphTargetInfluences}
            />
          </group>
          <group rotation={[0, 4, 0]} name="Plane003" scale={100}>
            <mesh
              name="Plane003_Branches_0"
              geometry={nodes.Plane003_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane003_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane003_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane004" scale={100}>
            <mesh
              name="Plane004_Branches_0"
              geometry={nodes.Plane004_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane004_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane004_Branches_0.morphTargetInfluences}
            />
          </group>
          <group rotation={[0, 1.7, 0]} name="Plane004" scale={100}>
            <mesh
              name="Plane004_Branches_0"
              geometry={nodes.Plane004_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane004_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane004_Branches_0.morphTargetInfluences}
            />
          </group>
          <group rotation={[0, 4, 0]} name="Plane004" scale={100}>
            <mesh
              name="Plane004_Branches_0"
              geometry={nodes.Plane004_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane004_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane004_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane005" scale={100}>
            <mesh
              name="Plane005_Branches_0"
              geometry={nodes.Plane005_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane005_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane005_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane006" scale={100}>
            <mesh
              name="Plane006_Branches_0"
              geometry={nodes.Plane006_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane006_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane006_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane007" scale={100}>
            <mesh
              name="Plane007_Branches_0"
              geometry={nodes.Plane007_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane007_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane007_Branches_0.morphTargetInfluences}
            />
          </group>
          <group name="Plane008" scale={100}>
            <mesh
              name="Plane008_Branches_0"
              geometry={nodes.Plane008_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane008_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane008_Branches_0.morphTargetInfluences}
            />
          </group>
           <group name="Plane009" scale={100}>
            <mesh
              name="Plane009_Branches_0"
              geometry={nodes.Plane009_Branches_0.geometry}
              material={materials.Branches}
              morphTargetDictionary={nodes.Plane009_Branches_0.morphTargetDictionary}
              morphTargetInfluences={nodes.Plane009_Branches_0.morphTargetInfluences}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/3D/pine-transformed.glb');
