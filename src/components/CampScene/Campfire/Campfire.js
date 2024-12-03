import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useAnimationStore } from '../../../store/store';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
import { Billboard, Text } from '@react-three/drei'; // Import the Text component
import FireLog from './FireLog';
import SmokeShader from './Smoke';
import EmberShader from './FireParticle';
import { RockA, RockB } from '../Assets/Camp/Rocks';

export default function Campfire(props) {
  const fireLightRef = useRef();
  const planeRef = useRef();
  const textGroupRef = useRef();
  const animationStore = useAnimationStore();
  const [coralNormalMap,  coralDiffuse, coralDisp] = useLoader(THREE.TextureLoader, [
    '/3D/textures/coral_wall_nor.jpg',
    '/3D/textures/coral_wall_diff.jpg',
    '/3D/textures/coral_wall_disp.jpg',
  ]);

  const { scale } = useSpring({
    scale: animationStore.stage === 2 ? 1.1 : 6,
    config: {
      mass: 1,
      tension: 70,
      friction: 14,
    },
  });

  const [hovered, setHovered] = useState(false); // Track hover state

  useFrame(({ clock }) => {
    if (fireLightRef.current && props.lightRef.current) {
      const flickerIntensity = props.lightRef.current.value;
      fireLightRef.current.power = flickerIntensity * 30 + 10;
    }
    if (textGroupRef.current) {
      const time = clock.getElapsedTime();
      const bounceHeight = Math.sin(time * 3) / 15;
      textGroupRef.current.position.y = 1 + bounceHeight;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    animationStore.increment();
  };

  const handleHoverStart = () => {
    if (animationStore.stage === 1) {
      setHovered(true);
    }
  };

  const handleHoverEnd = () => {
    if (animationStore.stage === 1) {
      setHovered(false);
    }
  };
  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.geometry.computeVertexNormals();
    }
  }, []);
  return (
    <group {...props}>
      <a.pointLight
        ref={fireLightRef}
        position={[0, 1, 0]}
        color={new THREE.Color(1, 0.654, 0.345)}
        decay={hovered && animationStore.stage !== 2 ? 4 : scale} // Change decay when hovering
        distance={20}
        castShadow
        randomSeed={Math.random()}
      />
      <group position={[0, -0.2, 0]} scale={0.7}>
        <mesh ref={planeRef} position={[0.2, -0.68, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.5, 2046]} />
          <meshStandardMaterial
            map={coralDiffuse}
            normalMap={coralNormalMap}
            displacementMap={coralDisp}
            displacementScale={0.2}
            roughness={1}
            normalScale={2}
          />
        </mesh>
        <group position={[0, 0.15, 0]}>
          <SmokeShader />
          <group position={[-0.2, 0, -0.2]}>
            <EmberShader />
          </group>
          <group onClick={handleClick} onPointerOver={handleHoverStart} onPointerOut={handleHoverEnd}>
            <FireLog
              rotation={[-0.5, 0, 0]}
              position={[0, 0, 0]}
              logScale={[1, 0.5, 1]}
              clip={{ x: 0, y: -0.2, z: 0.8 }}
              fireRotation={[-2.71, 0, 0]}
              firePosition={[0, 0.49, -0.13]}
            />
            <FireLog
              rotation={[-1.5, -0.4, -1.1]}
              position={[0.05, -0.24, -0.3]}
              logScale={[1, 0.5, 1]}
              clip={{ x: 0, y: 0, z: 0 }}
              fireRotation={[-1.9, 0, 0]}
              firePosition={[0, 0.2, 0.34]}
            />
            <FireLog
              rotation={[-1.53, -0.2, 0.35]}
              position={[0.32, -0.65, -0.4]}
              logScale={[1, 0.5, 1]}
              clip={{ x: 0, y: 0, z: 0 }}
              fireRotation={[-1.6, 0, 0]}
              firePosition={[0, 0.08, 0.5]}
            />
            <FireLog
              rotation={[1.33, -2.39, 1.07]}
              position={[0.06, 0, -0.58]}
              logScale={[0.6, 0.6, 0.6]}
              clip={{ x: 0, y: -0.5, z: 1 }}
              fireRotation={[-2.34, 0, 0]}
              firePosition={[0, 0.5, 0.01]}
            />
            <FireLog
              rotation={[-2.15, 0.55, 2.31]}
              position={[0.15, 0.01, -0.92]}
              logScale={[1, 0.5, 1]}
              clip={{ x: 0, y: -0.2, z: 0.8 }}
              fireRotation={[-2.2, 0, -0.3]}
              firePosition={[0, 0.43, 0.09]}
            />
            <FireLog
              rotation={[-0.86, 0.78, 0.77]}
              position={[0.66, -0.09, -0.22]}
              logScale={[0.8, 0.4, 0.8]}
              clip={{ x: 0, y: -0.2, z: 0.8 }}
              fireRotation={[-2.5, 0, 0]}
              firePosition={[0, 0.32, -0.07]}
            />
          </group>
        </group>
        <group position={[0.2, 0, -0.4]}>
          {Array.from({ length: 15 }).map((_, index) => {
            const angle = (index / 15) * Math.PI * 2;
            const x = Math.cos(angle) * 1.5;
            const z = Math.sin(angle) * 1.5;

            const RockComponent = index % 2 === 0 ? RockA : RockB;

            return (
              <RockComponent
                key={index}
                position={[x, -0.7, z]}
                rotation={[0, angle + 0.3, 0]}
                scale={[1.7, 1.7, 1.7]}
              />
            );
          })}
        </group>
      </group>
      {animationStore.stage < 2 && (
        <group ref={textGroupRef}>
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <Text
              font={'../../../fonts/itc-serif-gothic-regular.otf'}
              position={[-0.5, 0, -0.5]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Ignite
            </Text>
            <Text
              font={'../../../fonts/itc-serif-gothic-regular.otf'}
              position={[-0.5, -0.1, -0.5]}
              rotation={[Math.PI, 0, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              ^
            </Text>
          </Billboard>
        </group>
      )}
    </group>
  );
}
