import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fragmentShader = `
varying vec2 vUv;
uniform float time;
uniform float uFireFlyRadius;
uniform vec3 uColor;
varying float vOffset;

void main() {
    float distance = length(vUv - 0.5);
    float glow = smoothstep(0.50, uFireFlyRadius, distance);
    float disk = smoothstep(uFireFlyRadius, uFireFlyRadius - 0.01, distance);

    // Adjust flashing effect to include a minimum brightness
    float minFlash = 0.8; // Minimum brightness (20%)
    float flash = sin(time * 3.0 + vOffset * 0.12) * 0.4 + 0.6; 
    flash = max(flash, minFlash); 

    float alpha = clamp((glow + disk) * flash, 0.8, 1.0);

    vec3 glowColor = uColor * 3. * flash;
    vec3 fireFlyColor = uColor * 3.;

    vec3 finalColor = mix(glowColor, fireFlyColor, disk);

    gl_FragColor = vec4(uColor, 1.0);
}

`

const vertexShader = `
uniform float time;
uniform float uFireFlyRadius;
varying vec2 vUv;
varying float vOffset;

void main() {
    // Generate unique random values for each firefly based on the instance ID
    float randX = sin(float(gl_InstanceID) * 0.15 + time);
    float randY = cos(float(gl_InstanceID) * 0.2 + time);
    float randZ = sin(float(gl_InstanceID) * 0.13 + time);
    
    // Introduce displacement using the random values but reduce movement
    float displacementX = sin(time + randX) * 0.1;  
    float displacementY = sin(time + randY) * 0.1;
    float displacementZ = sin(time + randZ) * 0.1;

    // Apply some randomness for non-synchronized movement
    vec4 finalPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    
    // Introduce random directions for each firefly's movement
    finalPosition.x += displacementX + randX * 0.2;  
    finalPosition.y += displacementY + randY * 0.2;  
    finalPosition.z += displacementZ + randZ * 0.2;  

    gl_Position = projectionMatrix * finalPosition;

    vUv = uv;
    vOffset = float(gl_InstanceID);
}
`

const FirefliesShader = ({ count = 100 }) => {
  const meshRef = useRef()

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      uFireFlyRadius: { value: 0.3 },  // Firefly radius
      uColor: { value: new THREE.Color('yellow') } // Color of fireflies
    }),
    []
  );

  // Generate positions for the fireflies
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      pos.push(new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 10 - 5, Math.random() * 20 - 10))
    }
    return pos
  }, [count])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = clock.elapsedTime
    }
  })

  // Convert positions to matrices for each instance
  const instanceMatrices = useMemo(() => {
    const matrix = new THREE.Matrix4()
    const matrices = []

    positions.forEach((pos, idx) => {
      matrix.setPosition(pos)
      matrices.push(matrix.clone())
    })

    return matrices
  }, [positions])

  useFrame(() => {
    if (meshRef.current) {
      instanceMatrices.forEach((matrix, idx) => {
        meshRef.current.setMatrixAt(idx, matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.003, 8, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        emissive={new THREE.Color('yellow')}
        emissiveIntensity={0.5} // Makes them glow
      />
    </instancedMesh>
  )
}

export default FirefliesShader
