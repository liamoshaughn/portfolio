import React, { useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const Dandelion = ({ meshName, animationName, ...props }) => {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF('/3D/dandelion/dandelion-transformed.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (animationName && actions && actions[animationName]) {
      actions[animationName].play();
    }
  }, [actions, animationName]);

  // Memoize the mesh and material to avoid unnecessary re-renders
  const meshProps = useMemo(() => ({
    geometry: nodes[meshName].geometry,
    material: materials.dandelion_01,
    morphTargetDictionary: nodes[meshName].morphTargetDictionary,
    morphTargetInfluences: nodes[meshName].morphTargetInfluences,
  }), [nodes, materials, meshName]);

  return (
    <group scale={6} ref={group} {...props} dispose={null}>
      <mesh name={meshName} {...meshProps} />
    </group>
  );
};

export function DandelionB(props) {
  return <Dandelion {...props} meshName="dandelion_01_b_LOD3" animationName="Key.001Action" />;
}

export function DandelionA(props) {
  return <Dandelion {...props} meshName="dandelion_01_a_LOD3" animationName="KeyAction"/>;
}

export function DandelionC(props) {
  return <Dandelion {...props} meshName="dandelion_01_e_LOD3" animationName="Key.002Action" />;
}

useGLTF.preload('/3D/dandelion/dandelion-transformed.glb');
