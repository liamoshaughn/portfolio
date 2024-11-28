import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float time;
uniform sampler2D uPerlinTexture;
uniform float uAlphaDecay;
uniform vec3 uColor;
uniform float uGlowIntensity;

varying vec2 vUv;

void main() {
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= time * 0.03;

    float smoke = texture(uPerlinTexture, smokeUv).r;
    smoke = smoothstep(0.3, 1.0, smoke); // Adjusted smoothstep for better smoothness

    // Smoother edges with gradient
    smoke *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
    smoke *= 0.05;

    // Apply glowing effect based on intensity
    vec3 glowColor = uColor * uGlowIntensity;
    gl_FragColor = vec4(glowColor, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;

const vertexShader = `
uniform float time;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {
    vec3 newPosition = position;
    newPosition.y += 3.5;

    float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - time * 0.005)).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Subtle wind offset
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, time * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, time * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}
`;

const SmokeShader = ({ color = 'gray', glowIntensity = 1.5 }) => {
  const meshRef = useRef();

  // Use useMemo to load texture only once
  const noiseTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load('/3D/Noise/noise2.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  const uniforms = useRef({
    time: { value: 0 },
    uPerlinTexture: { value: noiseTexture },
    uAlphaDecay: { value: 0.1 },
    uColor: { value: new THREE.Color(color) },
    uGlowIntensity: { value: glowIntensity }
  });

  useFrame(({ clock }) => {
    uniforms.current.time.value = clock.elapsedTime * 2; // Update time
  });

  return (
    <mesh position={[-0.2, 0, -0.2]} rotation={[0, -1, 0]} ref={meshRef}>
      <planeGeometry args={[1, 3]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default SmokeShader;
