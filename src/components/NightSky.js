import React, { useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Create the custom star shader material
const StarShaderMaterial = shaderMaterial(
  {
    time: 0,
    size: 0.1,
    exclusionRadius: 0,  // New uniform for spherical exclusion
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 color;  // Attribute for color
    varying float vSize;
    varying vec3 vPosition;  // Pass world position to fragment shader
    varying vec3 vColor;  // Pass color to fragment shader

    void main() {
      vSize = size;
      vColor = color;  // Pass the color to the fragment shader
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

      // Add a twinkling effect using the sine of time
      float twinkle = sin(time * 1.0 + length(vPosition) * 0.1);  // Vary the speed and effect based on position
      float twinkleStrength = 0.8 + 0.5 * twinkle;  // Make the twinkling vary in intensity
      

      gl_FragColor = vec4(vColor * twinkleStrength, 1.0); // Apply the twinkle effect and random color
    }
  `
);

// Extend the material so React Three Fiber knows about it
extend({ StarShaderMaterial });

function NightSky() {
  const starCount = 10000;
  const stars = Array.from({ length: starCount }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000,
      (Math.random() - 0.5) * 1000
    ),
    size: Math.random() * 2 + 1, // Random star sizes
    color: new THREE.Color(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5), // Random color for each star
  }));

  const materialRef = useRef();
  const [time, setTime] = useState(0);

  // Update the time for the pulsating and twinkling effect of stars
  useFrame(() => {
    setTime((prevTime) => prevTime + 0.05);
    if (materialRef.current) {
      materialRef.current.time = time;
    }
  });

  return (
    <group>
      {/* Create the stars using a buffer geometry */}
      <points>
        <bufferGeometry>
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
          {/* Pass the color as an attribute to the shader */}
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={new Float32Array(stars.flatMap((s) => [s.color.r, s.color.g, s.color.b]))} // Pass the random colors
            itemSize={3}
          />
        </bufferGeometry>
        {/* Use the custom material */}
        <starShaderMaterial ref={materialRef} color="white" size={0.01} time={time} exclusionRadius={300} />
      </points>
      
    </group>
  );
}

export default NightSky;
