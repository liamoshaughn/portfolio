import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fragmentShader = `
varying vec2 vUv;
uniform float time;
uniform float uSmokeRadius;
uniform vec3 uColor;
uniform float uAlphaDecay;
varying float vOffset;

void main() {
    float distance = length(vUv - 0.5);
    float glow = smoothstep(0.50, uSmokeRadius, distance);
    float disk = smoothstep(uSmokeRadius, uSmokeRadius - 0.01, distance);

    // Fade effect
    float alpha = exp(-time * uAlphaDecay);
    alpha = clamp(alpha * (glow + disk), 0.1, 1.0);  // Ensure alpha does not go too low

    vec3 glowColor = uColor * 2.0;
    vec3 finalColor = mix(glowColor, uColor, disk);

    gl_FragColor = vec4(finalColor, alpha);
}
`;

const vertexShader = `
uniform float time;
uniform float uSmokeRadius;
varying vec2 vUv;
varying float vOffset;

void main() {
    float randX = sin(float(gl_InstanceID) * 0.25 + time);
    float randY = cos(float(gl_InstanceID) * 0.3 + time);
    float randZ = sin(float(gl_InstanceID) * 0.35 + time);

    float displacementX = sin(time + randX) * 0.5;
    float displacementY = cos(time + randY) * 1.0;  // Ensure upward movement
    float displacementZ = sin(time + randZ) * 0.5;

    vec4 finalPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);

    finalPosition.x += displacementX;
    finalPosition.y += displacementY;
    finalPosition.z += displacementZ;

    gl_Position = projectionMatrix * finalPosition;

    vUv = uv;
    vOffset = float(gl_InstanceID);
}
`;

const SmokeShader = ({ count = 100, color = 'gray' }) => {
  const meshRef = useRef()

  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      pos.push(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 10 - 5, Math.random() * 2 - 1))
    }
    return pos
  }, [count])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = clock.elapsedTime;
    }
  });

  const instanceMatrices = useMemo(() => {
    const matrix = new THREE.Matrix4();
    const matrices = [];
    positions.forEach((pos) => {
      matrix.setPosition(pos);
      matrices.push(matrix.clone());
    });
    return matrices;
  }, [positions]);

  useFrame(() => {
    if (meshRef.current) {
      instanceMatrices.forEach((matrix, idx) => {
        meshRef.current.setMatrixAt(idx, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.01, 8, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          uSmokeRadius: { value: 1 },
          uColor: { value: new THREE.Color(color) },
          uAlphaDecay: { value: 0.1 }
        }}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

export default SmokeShader;
