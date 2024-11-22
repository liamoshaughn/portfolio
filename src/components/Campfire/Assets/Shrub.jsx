import React from 'react';
import * as THREE from 'three'; // For scaling
import { useGLTF } from '@react-three/drei';

export function ShrubA() {
  const { nodes, materials } = useGLTF('/3D/shrub/shrubA.glb');

  // Clone and scale the geometry
  const scaledGeometry = React.useMemo(() => {
    const geom = nodes.shrub_01_a_LOD3.geometry.clone();
    geom.scale(6, 6, 6); // Example: Scale down by half
    geom.computeVertexNormals(); // Recompute normals after scaling
    return geom;
  }, [nodes.shrub_01_a_LOD3.geometry]);

  return {
    geometry: scaledGeometry,
    material: materials.shrub_01,
  };
}

export function ShrubB() {
  const { nodes, materials } = useGLTF('/3D/shrub/shrubB.glb')
  const scaledGeometry = React.useMemo(() => {
    const geom = nodes.shrub_01_c_LOD3.geometry.clone();
    geom.scale(6, 6, 6); // Example: Scale down by half
    geom.computeVertexNormals(); // Recompute normals after scaling
    return geom;
  }, [nodes.shrub_01_c_LOD3.geometry]);

  return {
    geometry: scaledGeometry,
    material: materials.shrub_01,
  };
}

useGLTF.preload('/3D/shrub/shrubB.glb')
useGLTF.preload('/3D/shrub/shrubA.glb');
