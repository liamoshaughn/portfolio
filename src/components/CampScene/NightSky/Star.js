import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Star({ position = [0, 0, 0], color = [1, 1, 1], size = 5 }) {
  const pointsRef = useRef();

  // Uniforms to store time and fade progress
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime();
      // Fade-in logic
      const fadeDuration = 2; // Duration for fade-in (in seconds)
      const fadeProgress = Math.min(time / fadeDuration, 1); // Fade in over time

      // Twinkling logic after fade-in
      const twinkle = Math.sin(time * 2.0) * 0.3 + 0.7; // Simple twinkling effect

      // Update the uniforms with fade progress and twinkle
      pointsRef.current.material.uniforms.time.value = time;
      pointsRef.current.material.uniforms.fade.value = fadeProgress;
      pointsRef.current.material.uniforms.size.value = size * twinkle;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1}
          array={new Float32Array(position)} // Single position
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={1}
          array={new Float32Array(color)} // Single color
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexColors
        uniforms={{
          time: { value: 0 },
          fade: { value: 0 },  // Fade-in progress
          size: { value: size },
        }}
        vertexShader={`
          uniform float size;
          uniform float fade;  // New uniform for fade-in effect
          varying vec3 vColor;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size;

            // Apply the fade-in effect based on the fade uniform
            gl_PointSize *= fade;  // Scale the point size based on fade progress
          }
        `}
        fragmentShader={`
          varying vec3 vColor;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard; // Only draw the star if the fragment is inside the circle

            // Set the color with fading effect
            gl_FragColor = vec4(vColor, 1.0);
          }
        `}
      />
    </points>
  );
}
