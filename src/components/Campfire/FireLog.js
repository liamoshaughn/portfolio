import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Log } from './Log';
import { LongLog } from './LongLog';


const fragflame = `
    precision highp float;

    uniform float time;
    uniform sampler2D noise;
    uniform vec3 clippingPlaneNormal; // Clipping plane normal
    uniform float clippingPlaneConstant; // Clipping plane constant

    varying vec3 camPos;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vClippingDistance; // Clipping distance from vertex shader

    void main() {
        // Sample noise texture
        vec3 noisetex = texture2D(noise, mod(0.5 * vec2(vUv.y + time * 1.0, vUv.x - time * 1.0), 1.0)).rgb;

        // Map noise value to opacity
        float noise = noisetex.r; // Use the red channel of the noise texture
        float opacity = smoothstep(0.1, 1.4, noise - (0.4 - smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.3, 1.0, vUv.y))));

        // Color gradient: adjust to suit flame colors
        vec3 color = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), opacity);

        // Clip if behind the clipping plane
        if (vClippingDistance < 0.0) {
            discard; // Discard fragment if behind clipping plane
        }

        // Apply color and opacity
        gl_FragColor = vec4(color, opacity);
    }
`;




const vertflame = `
    varying vec2 vUv;
    varying vec3 camPos;
    varying vec3 vNormal;
    uniform sampler2D noise;
    uniform float time;
    varying float vClippingDistance;
    uniform vec3 clippingPlaneNormal; 
    uniform float clippingPlaneConstant;

    void main() {
        vUv = uv;
        camPos = cameraPosition;
        vNormal = normal;
        vec3 pos = vec3(position.x,position.y,position.z);
        vec3 noisetex = texture2D(noise,mod(.5*vec2(vUv.y+time*1.9,vUv.x - time*1.9),1.)).rgb;
        if(pos.y >= 1.87){
            pos = vec3(
                position.x*(sin((position.y - 0.64)*1.27)-0.12),
                position.y,
                position.z*(sin((position.y - 0.64)*1.27)-0.12));
        } else{
            pos = vec3(
                position.x*(sin((position.y/10. -  .21)*.11)+1.),
                position.y,
                position.z*(sin((position.y/10. -  .21)*.11)+1.));
        }
        pos.xz *= noisetex.r;
        vClippingDistance = dot(clippingPlaneNormal, pos) + clippingPlaneConstant;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

export default function FireLog(props) {
  const meshRef = useRef();
  const shaderRef = useRef();
  const fireLightRef = useRef();
  const random = Math.random()*2

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value =  random+clock.getElapsedTime() / 5;
    }
    if (fireLightRef.current) {
      const time = clock.getElapsedTime();
      const sineFunction =
        Math.sin(time) * Math.sin(time) +
        Math.sin(2 * time) -
        Math.cos(time) * Math.sin((3 * time) / 2) +
        Math.random() * 0.2 -
        0.1;

      const flicker = Math.abs(sineFunction) * 0.5 + 0.5;
      fireLightRef.current.intensity = flicker * 10;
    }
  });

  useEffect(() => {
    if (fireLightRef.current) {
      const lightHelper = new THREE.PointLightHelper(fireLightRef.current); // 5 is the size of the helper
      fireLightRef.current.parent.add(lightHelper); // Ensure the helper is added to the same parent as the light

      // Clean up the helper when the component unmounts
      return () => {
        fireLightRef.current.parent.remove(lightHelper);
        lightHelper.dispose();
      };
    }
  }, []);

  return (
    <group position={props.position} rotation={props.rotation}>
      <mesh position={[0, -0.5, -0.8]} scale={[0.35, 1, 0.9]} rotation={[Math.PI / 1, 0, 0]} ref={meshRef}>
        <cylinderGeometry args={[4, 1, 5, 100, 100, true]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertflame}
          fragmentShader={fragflame}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
          wireframe={false}
          uniforms={{
            clippingPlaneNormal: { value: new THREE.Vector3(0, -1, -0.5) }, // Plane normal
            clippingPlaneConstant: { value: 0.5 },
            time: { type: 'f', value: 0.0 },
            noise: {
              type: 't',
              value: new THREE.TextureLoader().load('3D/Noise/noise2.png'),
            },
          }}
        />
      </mesh>
      <group position={props.logPosition}>
        <pointLight
          ref={fireLightRef}
          position={[2, 1, 1]}
          intensity={10}
          color={new THREE.Color('#fefa9b')}
          decay={0.1}
          distance={100}
          castShadow={true}
        />
        <LongLog  rotation={props.logRotation} />
      </group>
    </group>
  );
}
