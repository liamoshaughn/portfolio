import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Log } from './Log';
import FireLog from './FireLog';

let options = {
  color: [213, 100, 14],
};

const fragflame = `
    varying vec2 vUv;
    uniform sampler2D noise;
    uniform vec3 color4;
    uniform float time;
    varying vec3 vNormal;

    vec3 rgbcol(vec3 col) {
        return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
    }

      
   void main() {
    vec3 noisetex = texture2D(noise, mod(1. * vec2(vUv.y + time * 2., vUv.x - time * 1.), 1.)).rgb;
    vec3 flameColor = vec3(1.0, 0.5, 0.2); 
    gl_FragColor = vec4(noisetex.r * flameColor, noisetex.r);

    if (gl_FragColor.r >= 0.44) {
        gl_FragColor = vec4(rgbcol(color4), gl_FragColor.r);
    } else {
        gl_FragColor = vec4(0.0);
    }

    gl_FragColor *= vec4(smoothstep(0.2, 0.628, vUv.y));
    gl_FragColor.rgb *= 2.0; // Boost brightness for bloom effect
}


`;

const vertflame = `
    varying vec2 vUv;
    varying vec3 camPos;
    varying vec3 vNormal;
    uniform sampler2D noise;
    uniform float time;

    void main() {
        vUv = uv;
        camPos = cameraPosition;
        vNormal = normal;
        vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
        vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y+time*2.,vUv.x - time*1.),1.)).rgb;
        if(pos.y >= 1.87){
            pos = vec3(
                position.x*(sin((position.y - 0.64)*1.27)-0.12),
                position.y,
                position.z*(sin((position.y - 0.64)*1.27)-0.12));
        } else{
            pos = vec3(
                position.x*(sin((position.y/2. -  .01)*.11)+0.79),
                position.y,
                position.z*(sin((position.y/2. -  .01)*.11)+0.79));
        }
        pos.xz *= noisetex.r;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

export default function Campfire() {
  const meshRef = useRef();
  const shaderRef = useRef();
  const fireLightRef = useRef();

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime() / 4;
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
      fireLightRef.current.intensity = flicker * 50.5;
    }
  });

  return (
    <>
      <FireLog position={[0,0,0]} logPosition={[-1, -1, -1]} logRotation={[Math.PI/1.5, 0,0]}  />
      <FireLog position={[0,0,-3]} rotation={[0,Math.PI/1,0]} logPosition={[-1, -1, -1]} logRotation={[Math.PI/1.5, 0,0]}  />
    </>
  );
}
