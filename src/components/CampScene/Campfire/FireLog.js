import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LongLog } from '../Assets/LongLog';
import { useAnimationStore } from '../../../store/store';
import { useSpring, a } from '@react-spring/three';

const fragflame = `
  precision highp float;

  uniform float time;
  uniform sampler2D noise;

  varying vec3 camPos;
  varying vec2 vUv;
  varying float vClippingDistance; 

  void main() {
      vec3 noisetex = texture2D(noise, mod(0.5 * vec2(vUv.y + time * 1.0, vUv.x - time * 1.0), 1.0)).rgb;


      float noiseValue = noisetex.r; 
 
      // Fades opacity based on the noise value and the smoothstep result for vUv.y
      float opacity = smoothstep(0.0, 0.6, noiseValue - (0.5 - smoothstep(0.0, 1.0, vUv.y) * (1.0 - smoothstep(0.4, 1.0, vUv.y))));

      // Create a gradient effect based on vertical position (vUv.y) for fire color
      float gradient = smoothstep(0.0, 1.0, vUv.y); 

      // Fire-like color gradient: interpolate between red (lower) and yellow (higher)
      vec3 color = mix(vec3(1.0, 0.1, 0.0), vec3(1.0, 1.0, 0.0), gradient); 

      // Clipping: Discard fragment if it is behind the clipping plane
      if (vClippingDistance < 0.0) {
          discard; // Discard fragment if behind clipping plane
      }

      gl_FragColor = vec4(color, opacity);


      gl_FragColor.a *= noiseValue; 
  }
`;

const vertflame = `
varying vec2 vUv;
varying vec3 camPos;
uniform sampler2D noise;
uniform float time;
varying float vClippingDistance;
uniform vec3 clippingPlaneNormal; 
uniform float clippingPlaneConstant;

void main() {
    vUv = uv;
    camPos = cameraPosition;
    
    vec3 pos = vec3(position.x, position.y, position.z);
    
    // Add noise to manipulate flame shape dynamically
    vec3 noisetex = texture2D(noise, mod(1.0 * vec2(vUv.y + time * 2.0, vUv.x - time * 1.0), 1.0)).rgb;
    
    // Add more dynamic flame distortion
    if (pos.y >= 1.87) {
        pos = vec3(
            position.x * (sin((position.y - 0.64) * 1.27) - 0.12),
            position.y,
            position.z * (sin((position.y - 0.64) * 1.27) - 0.12)
        );
    } else {
        pos = vec3(
            position.x * (sin((position.y / 10.0 - 0.21) * 0.11) + 1.0),
            position.y,
            position.z * (sin((position.y / 10.0 - 0.21) * 0.11) + 1.0)
        );
    }
    
    // Apply noise-based distortion on xz plane
    pos.xz *= noisetex.r;
    vClippingDistance = dot(clippingPlaneNormal, pos) + clippingPlaneConstant;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`;

export default function FireLog(props) {
  const meshRef = useRef();
  const shaderRef = useRef();
  const groupRef = useRef({ value: 0 });
  const random = Math.random() * 2;
  const animationStore = useAnimationStore();

  const uniforms = useMemo(
    () => ({
      clippingPlaneNormal: { value: new THREE.Vector3(props.clip.x, props.clip.y, -props.clip.z) },
      clippingPlaneConstant: { value: 0.5 },
      time: { type: 'f', value: 0.0 },
      noise: {
        type: 't',
        value: new THREE.TextureLoader().load('3D/Noise/noise2.png'),
      },
    }),
    [props.clip.x, props.clip.y, props.clip.z]
  );

  const { scale } = useSpring({
    scale: animationStore.stage === 2 ? 1 : 0, // Target scale based on stage
    config: {
      mass: 1,     
      tension: 170, 
      friction: 14, 
    }, 
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = random + time / 5;
    }
  });

  return (
    <group position={props.position} rotation={props.rotation}>
      <a.group ref={groupRef} scale={scale}>
        <mesh position={props.firePosition} scale={[0.15, 0.3, 0.5]} rotation={props.fireRotation} ref={meshRef}>
          <cylinderGeometry args={[4.5, 0.1, 10, 100, 100, true]} />
          <shaderMaterial
            ref={shaderRef}
            vertexShader={vertflame}
            fragmentShader={fragflame}
            transparent={true}
            depthWrite={false}
            depthTest = {true}
            side={THREE.DoubleSide}
            wireframe={false}
            uniforms={uniforms}
          />
        </mesh>
      </a.group>
      <LongLog scale={props.logScale} />
    </group>
  );
}
