/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 spacesuit.glb 
*/

import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function Spacesuit(props) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/3D/spacesuit.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && actions['Breathing']) {

      actions['Breathing'].play();
    } 
  }, [actions]);  

  useEffect(() => {
    if (materials.dead_tree_trunk_02) {
      materials.dead_tree_trunk_02.metalness= 1
      materials.dead_tree_trunk_02.needsUpdate = true
    }
  }, [materials])
  
  return (
    <group scale={2.5} ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0.579, 0.48, 0.172]} rotation={[1.925, 0.406, -2.131]}>
          <primitive object={nodes.Spine} />
          <primitive object={nodes.neutral_bone} />
          <group name="Object_6003">
            <skinnedMesh name="SpaceSuit_SuitMat_0003" geometry={nodes.SpaceSuit_SuitMat_0003.geometry} material={materials['SuitMat.001']} skeleton={nodes.SpaceSuit_SuitMat_0003.skeleton} />
            <skinnedMesh name="SpaceSuit_SuitMat_0003_1" geometry={nodes.SpaceSuit_SuitMat_0003_1.geometry} material={materials['HelmetMat.001']} skeleton={nodes.SpaceSuit_SuitMat_0003_1.skeleton} />
          </group>
        </group>
        <mesh castShadow name="Object_7003" geometry={nodes.Object_7003.geometry} material={materials['BackpackMat.001']} position={[-1.084, -0.032, 0.005]} rotation={[0.386, -0.009, -0.003]} scale={0.006} />
        <mesh castShadow name="dead_tree_trunk_02_LOD3" geometry={nodes.dead_tree_trunk_02_LOD3.geometry} material={materials.dead_tree_trunk_02} position={[0, 0.079, 0]} rotation={[-2.753, -0.055, 3.008]} />
      </group>
    </group>
  )
}

useGLTF.preload('/3D/spacesuit.glb')