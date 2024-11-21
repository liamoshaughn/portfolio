import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import bladeDiffuse from './resources/blade_diffuse.jpg';
import bladeAlpha from './resources/blade_alpha.jpg'; 

export default function GrassField(props) {
  const [diffuseTexture, alphaTexture] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha]);
  const instancedRef = useRef();

  const count = 50000; // Number of grass blades


  const geometry = useMemo(() => {
    const segments = 20; // More segments for smoother bending
    const geom = new THREE.PlaneGeometry(0.1, 1, 1, segments);

    const positions = geom.attributes.position.array;
    const bendAmount = 0.4; // Maximum bending near the tip
    const straightThreshold = 0.05; // Bottom remains straight

    for (let i = 0; i < positions.length; i += 3) {
      const yPos = positions[i + 1]; // Y position of the vertex
      const normalizedHeight = yPos / 1; // Normalize height (0 at base, 1 at tip)

      if (normalizedHeight > straightThreshold) {
        // Quadratic easing for smooth, gradual bending
        const curveValue = Math.pow((normalizedHeight - straightThreshold) / (1 - straightThreshold), 2) * bendAmount;
        positions[i + 2] += curveValue; // Bend along the Z-axis
      }
    }

    geom.attributes.position.needsUpdate = true;
    geom.computeVertexNormals(); // Ensure proper shading

    return geom;
  }, []);

  // Randomize positions and rotations for each blade
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fieldPositions = useMemo(() => {
    const positions = [];
    const size = 50
    for (let i = 0; i < count; i++) {
      const xPos = (Math.random() - 0.5) * size; 
      const zPos = (Math.random() - 0.5) * size*2; 

      

      if (Math.abs(xPos -( 4*(Math.sin(zPos^2)*0.5))+size/2) < 3) { 
        continue;
      }

      positions.push({
        position: new THREE.Vector3(xPos, 0, zPos),
        rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0), 
        scale: new THREE.Vector3(1, 1 + Math.random() * 0.5, 1) 
      });
    }
    return positions;
  }, [count]);

  // Apply transformation for each blade
  useFrame(() => {
    fieldPositions.forEach((data, i) => {
      dummy.position.copy(data.position);
      dummy.rotation.copy(data.rotation);
      dummy.scale.copy(data.scale);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      position={[15, -0.7, 5]}
      scale={0.3}
      {...props}
      ref={instancedRef}
      args={[geometry, null, count]} 
    >
      <meshStandardMaterial
        map={diffuseTexture}
        alphaMap={alphaTexture}
        transparent={true} 
        side={THREE.DoubleSide} 
        depthWrite={false} 
        depthTest={true}
        alphaTest={0}
        flatShading={true}
      />
    </instancedMesh>
  );
}
