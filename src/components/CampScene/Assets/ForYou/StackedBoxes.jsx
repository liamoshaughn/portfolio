/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 umbrellaLight.glb 
*/

import React from 'react'
import { Gltf, useGLTF } from '@react-three/drei'

export function StackedBoxes(props) {
  return (
    <Gltf castShadow {...props} src={'/3D/stackedBoxes.glb'} />
  )
}

useGLTF.preload('/3D/stackedBoxes.glb')