/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 tree.glb --transform 
Files: tree.glb [7.78MB] > /home/liam/Desktop/Projects/Portfolio/portfolio/public/3D/tree-transformed.glb [562.62KB] (93%)
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Tree(props) {
  const { nodes, materials } = useGLTF('/3D/tree-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Circle001_Bark_0.geometry} material={materials['Bark.001']} position={[0.114, -0.02, 0.003]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1.398]} />
      <mesh geometry={nodes.Plane001_Branches_0.geometry} material={materials['Branches.001']} position={[0.151, 11.071, -0.049]} rotation={[-2.05, -0.367, 2.206]} scale={[3.904, 2.354, 4.051]} />
    </group>
  )
}

useGLTF.preload('/3D/tree-transformed.glb')
