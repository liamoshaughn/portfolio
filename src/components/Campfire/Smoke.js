import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragflame = `
precision highp float;

uniform float time;
uniform sampler2D noise;

varying vec2 vUv;

void main() {
    vec3 noisetex = texture2D(noise, mod(vec2(vUv.y + time * 0.2, vUv.x - time * 0.2), 1.0)).rgb;

    float opacity = smoothstep(0.0, 0.4, noisetex.r);

    // Layered noise for varying transparency
    float noiseTransparency = texture2D(noise, mod(vec2(vUv.y + time * 0.1, vUv.x), 1.0)).r;
    opacity *= smoothstep(0.3, 0.7, noiseTransparency);

    float gradient = smoothstep(0.0, 1.0, vUv.y);
    vec3 color = mix(vec3(0.2), vec3(0.8 * gradient), gradient);

    gl_FragColor = vec4(color, opacity);
    gl_FragColor.a *= opacity;
}
`;

const vertflame = `
varying vec2 vUv;
uniform sampler2D noise;
uniform float time;

void main() {
    vUv = uv;
    vec3 pos = position;

    // Add a twisting effect as the smoke rises
    float rotationSpeed = 1.0; // How fast the smoke twists (adjust as needed)
    float rotationAmount = sin(pos.y * 0.2 + time * rotationSpeed) * 0.5; // Twist based on height and time

    // Create a rotation matrix for the Y-axis (2D rotation around the Y axis)
    mat2 rotationMatrix = mat2(
        cos(rotationAmount), -sin(rotationAmount),
        sin(rotationAmount), cos(rotationAmount)
    );

    // Apply the twist rotation to the xz coordinates (keeping y unchanged)
    vec2 rotatedXZ = rotationMatrix * pos.xz;

    // Update position with the rotated xz and keep y unchanged
    pos.x = rotatedXZ.x;
    pos.z = rotatedXZ.y;

    // Add subtle noise movement for the smoke
    vec3 noisetex = texture2D(noise, mod(vec2(vUv.y + time * 0.2, vUv.x - time * 0.2), 1.0)).rgb;
    pos.xz *= noisetex.r;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`;

export default function Smoke(props) {
    const meshRef = useRef();
    const shaderRef = useRef();
    const random = Math.random() * 2;

    useFrame(({ clock }) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.time.value = random + clock.getElapsedTime() / 5;
        }
    });

    return (
        <mesh position={[-0.2, 2, -0.2]} rotation={[0, 0, Math.PI]} scale={[0.15, 0.3, 0.5]} ref={meshRef}>
            <cylinderGeometry args={[2, 0.1, 20, 100, 100, true]} />
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertflame}
                fragmentShader={fragflame}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
                wireframe={false}
                uniforms={{
                    time: { type: 'f', value: 0.0 },
                    noise: {
                        type: 't',
                        value: new THREE.TextureLoader().load('3D/Noise/noise2.png'), // Ensure this noise texture is high quality
                    },
                }}
            />
        </mesh>
    );
}
