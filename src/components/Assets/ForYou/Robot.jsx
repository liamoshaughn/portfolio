/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 robot.glb --transform 
Files: robot.glb [1.36MB] > /home/liam/Desktop/Projects/Portfolio/PortfolioAssets/robot-transformed.glb [83.68KB] (94%)
Author: gornostai (https://sketchfab.com/gornostai)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/robot-love-death-and-robots-c54c32bed0364e11aeefd380950ab361
Title: Robot (Love, Death and Robots)
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Robot(props) {
  const { nodes, materials } = useGLTF('/3D/robot-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder_Material001_0.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI / 2, 0, 0]} scale={1} />
    </group>
  )
}

useGLTF.preload('/robot-transformed.glb')
