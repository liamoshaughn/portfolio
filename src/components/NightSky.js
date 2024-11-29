import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import seedrandom from 'seedrandom';
import { useUtilityStore } from '../store/store';

// Create the custom star shader material
const StarShaderMaterial = shaderMaterial(
  {
    time: 0,
    size: 0.1,
    exclusionRadius: 0,
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 color;  // Attribute for color
    attribute float fade;  // Attribute for fade duration
    varying float vSize;
    varying vec3 vPosition;  // Pass world position to fragment shader
    varying vec3 vColor;  // Pass color to fragment shader
    varying float vFade;  // Pass fade attribute to fragment shader

    void main() {
      vSize = size;
      vColor = color;  // Pass the color to the fragment shader
      vFade = fade;  // Pass fade to fragment shader
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);  // Transform position to view space
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz; // Get the world position
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = vSize;  // Set the point size from the vertex shader
    }
  `,
  // Fragment Shader
  `
    varying float vSize;
    varying vec3 vPosition;  // World position passed from vertex shader
    varying vec3 vColor; // Color passed from vertex shader
    varying float vFade; // Fade duration passed from vertex shader
    uniform float time;
    uniform float exclusionRadius;

    void main() {
      // Calculate the 3D distance from the center of the scene (origin)
      float distFromCenter = length(vPosition);  // Using the full 3D distance (x, y, z)

      // Exclude stars near the center (inside the exclusion sphere)
      if (distFromCenter < exclusionRadius) discard;  // Discard stars too close to the center

      // Calculate the distance from the center of the point
      float dist = length(gl_PointCoord - vec2(0.5));

      // Discard pixels outside the star shape (circle)
      if (dist > 0.5) discard;

      // Calculate fade effect based on the time and fade attribute
      float fadeEffect = smoothstep(vFade, vFade + 5.0, time);  // Smooth fade-in effect based on fade attribute

      // Add a twinkling effect using the sine of time
      float twinkle = sin(time * 1.0 + length(vPosition) * 0.1);  // Vary the speed and effect based on position
      float twinkleStrength = 0.8 + 0.5 * twinkle;  // Make the twinkling vary in intensity

      gl_FragColor = vec4(vColor * twinkleStrength * fadeEffect, 1.0); // Apply twinkle and fade effect
    }
  `
);

extend({ StarShaderMaterial });

function NightSky() {
  const rng = seedrandom(1); 
  const starCount = 8000;
  const {estimatedLoadTime} = useUtilityStore()

  console.log(estimatedLoadTime)
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, () => ({
      position: new THREE.Vector3(
        (rng() - 0.5) * 500 + 300,
        (rng() - 0.5) * 600,
        (rng() - 0.5) * 800 - 50
      ),
      size: rng() * 2 + 1, // Random star sizes
      color: new THREE.Color(rng() + 0.1, rng() + 0.1, rng() + 0.1), // Random color for each star
      fade: rng() * 10 *  estimatedLoadTime
    }));
  }, [starCount]);

  const uniforms = useMemo(
    () => ({
      exclusionRadius: { value: 300 },
      size: { value: 0.01 },
      time: { type: 'f', value: 0.0 },
    }),
    []
  );

  const materialRef = useRef();

  // Update the time for the pulsating and twinkling effect of stars
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time * 3;
    }
  });

  // Update buffer geometry on starCount change
  const geometryRef = useRef();

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.attributes.position.array = new Float32Array(stars.flatMap((s) => [s.position.x, s.position.y, s.position.z]));
      geometryRef.current.attributes.size.array = new Float32Array(stars.map((s) => s.size));
      geometryRef.current.attributes.color.array = new Float32Array(stars.flatMap((s) => [s.color.r, s.color.g, s.color.b]));
      geometryRef.current.attributes.fade.array = new Float32Array(stars.map((s) => s.fade)); // Pass fade attribute
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.size.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
      geometryRef.current.attributes.fade.needsUpdate = true; // Ensure fade attribute is updated
    }
  }, [stars]);

  return (
    <group>
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
            array={new Float32Array(stars.flatMap((s) => [s.color.r, s.color.g, s.color.b]))} // Pass the random colors
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-fade"
            count={starCount}
            array={new Float32Array(stars.map((s) => s.fade))} // Pass the fade attribute
            itemSize={1}
          />
        </bufferGeometry>
        <starShaderMaterial uniforms={uniforms} ref={materialRef} color="white" />
      </points>
    </group>
  );
}

export default NightSky;
