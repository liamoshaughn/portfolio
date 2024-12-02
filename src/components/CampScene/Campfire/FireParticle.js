import React, { useRef, useState, useEffect } from 'react';
import {  useFrame } from '@react-three/fiber';
import { ShaderMaterial } from 'three';
import { BufferGeometry, Float32BufferAttribute } from 'three';

function FireEmbers() {
  const particlesRef = useRef();
  const [particles, setParticles] = useState({
    positions: [],
    velocities: []
  });

  useEffect(() => {
    const numParticles = 5;
    const positions = [];
    const velocities = [];

    // Generate positions and velocities for the particles
    for (let i = 0; i < numParticles; i++) {
      positions.push(Math.random() * 0.75 - 0.35);  // x (narrower range)
      positions.push(Math.random() * 10 - 5);  // y (closer together)
      positions.push(Math.random() * 0.75 - 0.35);  // z (narrower range)

      velocities.push(Math.random() * 0.05 - 0.025);  // vx (more horizontal movement)
      velocities.push(Math.random() * 0.03 + 0.05);   // vy (upward force)
      velocities.push(Math.random() * 0.05 - 0.025);  // vz (more horizontal movement)
    }

    // Set particles in state once data is generated
    setParticles({ positions, velocities });
  }, []);
  
  useFrame(() => {
    if (particles.positions.length > 0) {
      const newPositions = [...particles.positions];
      const newVelocities = [...particles.velocities];

      for (let i = 0; i < newPositions.length; i += 3) {
        newPositions[i] += newVelocities[i];    
        newPositions[i + 1] += newVelocities[i + 1]; 
        newPositions[i + 2] += newVelocities[i + 2]; 

        // Reset particles to loop them back to the starting point when they go out of view
        if (newPositions[i + 1] > 4) {
          newPositions[i + 1] = Math.random() * 0.2 - 0.1; 
          newPositions[i] = Math.random() * 1.5 - 0.75; 
          newPositions[i + 2] = Math.random() * 1.5 - 0.75;
        }
      }


      setParticles({ positions: newPositions, velocities: newVelocities });


      if (particlesRef.current) {
        particlesRef.current.geometry.attributes.position.array = new Float32BufferAttribute(newPositions, 3).array;
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(particles.positions, 3));

  const material = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        vColor = position;
        // Calculate opacity based on the Y position
        vOpacity = 1.0 - (position.y / 4.0); // Fade out as Y increases
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;
      void main() {
        float intensity = 1.0 - length(vColor) * 0.1;
        gl_FragColor = vec4(intensity, intensity * 0.5, 0.0, vOpacity);  // Use vOpacity for transparency
      }
    `,
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={material} />
  );
}

export default FireEmbers;
