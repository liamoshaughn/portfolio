import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import seedrandom from 'seedrandom';
import { useAnimationStore } from '../../../store/store';

// Create the custom star shader material
const StarShaderMaterial = shaderMaterial(
  {
    time: 0,
    size: 0.1,
    exclusionRadius: 0,
    fadeDuration: 10, 
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 color; 
    attribute float loadingValue;
    varying float vLoadingValue;
    varying float vSize;
    varying vec3 vPosition;  
    varying vec3 vColor;  
    
    void main() {
      vSize = size;
      vLoadingValue = loadingValue;
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);  
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz; 
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = vSize; 
    }
  `,
  // Fragment Shader
  ` 
    varying float vSize;
    varying vec3 vPosition;  
    varying vec3 vColor; 
    varying float vLoadingValue;
    uniform float time;
    uniform float exclusionRadius;
    uniform float loadingProgress;
    uniform float fadeDuration;

    void main() {
      // Calculate the 3D distance from the center of the scene (origin)
      float distFromCenter = length(vPosition);  // Using the full 3D distance (x, y, z)
      
      // Exclude stars near the center (inside the exclusion sphere)
      if (distFromCenter < exclusionRadius) discard;  // Discard stars too close to the center

      // Fade effect: Stars only appear if their loadingValue is less than or equal to loadingProgress
      if (vLoadingValue > loadingProgress) discard;

      // Fade-in effect based on time
      float fadeTime = (time - vLoadingValue / 100.0) / fadeDuration; // Linear fade-in timing
      fadeTime = smoothstep(0.0, 1.0, fadeTime);  // Smooth interpolation to make the fade-in smoother

      // Twinkle effect (optional, based on time and position)
      float twinkle = sin(time * 1.0 + length(vPosition) * 0.1);  
      float twinkleStrength = 0.8 + 0.5 * twinkle;  // Vary twinkling intensity

      // Apply fade-in and twinkle effects to the star color
      gl_FragColor = vec4(vColor * twinkleStrength * fadeTime, 1.0); // Apply fade and twinkle effect
    }
`
);

extend({ StarShaderMaterial });

function NightSky() {
  const rng = seedrandom(1);
  const starCount = 8000;
  const { loadingProgress } = useAnimationStore();

  const stars = useMemo(() => {
    return Array.from({ length: starCount }, () => ({
      position: new THREE.Vector3((rng() - 0.5) * 500 + 300, (rng() - 0.5) * 600, (rng() - 0.5) * 800 - 50),
      size: rng() * 2 + 1, // Random star sizes
      color: new THREE.Color(rng() + 0.1, rng() + 0.1, rng() + 0.1),
      loadingValue: rng() * 100, // Set a random loading value for each star
    }));
  }, [starCount]);

  const uniforms = useMemo(
    () => ({
      exclusionRadius: { value: 300 },
      size: { value: 0.01 },
      time: { type: 'f', value: 0.0 },
      loadingProgress: { value: 0.0 },
      fadeDuration: { value: 20 }, // 10 seconds fade-in time
    }),
    []
  );

  const materialRef = useRef();

  // Update the time and loading progress for the pulsating and twinkling effect of stars
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time * 3;
      materialRef.current.uniforms.loadingProgress.value = loadingProgress;
    }
  });

  const geometryRef = useRef();

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.attributes.position.array = new Float32Array(
        stars.flatMap((s) => [s.position.x, s.position.y, s.position.z])
      );
      geometryRef.current.attributes.size.array = new Float32Array(stars.map((s) => s.size));
      geometryRef.current.attributes.color.array = new Float32Array(
        stars.flatMap((s) => [s.color.r, s.color.g, s.color.b])
      );
      geometryRef.current.attributes.loadingValue.array = new Float32Array(stars.map((s) => s.loadingValue));
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.size.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
      geometryRef.current.attributes.loadingValue.needsUpdate = true;
    }
  }, [stars]);

  return (
    <group rotation={[0, 0, 0]}>
      <points>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={new Float32Array(stars.flatMap((s) => [s.position.x, s.position.y, s.position.z]))}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starCount}
            array={new Float32Array(stars.map((s) => s.size))}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={new Float32Array(stars.flatMap((s) => [s.color.r, s.color.g, s.color.b]))}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-loadingValue"
            count={starCount}
            array={new Float32Array(stars.map((s) => s.loadingValue))}
            itemSize={1}
          />
        </bufferGeometry>
        <starShaderMaterial uniforms={uniforms} ref={materialRef} color="white" />
      </points>
    </group>
  );
}

export default NightSky;
