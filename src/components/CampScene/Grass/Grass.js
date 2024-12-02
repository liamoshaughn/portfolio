// Based on https://codepen.io/al-ro/pen/jJJygQ by al-ro, but rewritten in react-three-fiber by drcmda https://codesandbox.io/p/sandbox/5xho4, rewritten again to fit the application
import * as THREE from 'three';
import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';

//These have been taken from "Realistic real-time grass rendering" by Eddie Lee, 2010
import bladeDiffuse from './resources/blade_diffuse.jpg';
import bladeAlpha from './resources/blade_alpha.jpg';
import './GrassMaterial';
import { useAnimationStore } from '../../../store/store';

export default function Grass({ options = { bW: 0.12, bH: 1, joints: 5 }, width = 400, ...props }) {
  const { bW, bH, joints } = options;
  const materialRef = useRef();
  const [texture, alphaMap, noise] = useLoader(THREE.TextureLoader, [bladeDiffuse, bladeAlpha, '/3D/Noise/noise2.png']);
  const attributeData = useMemo(() => getAttributeData(width), [ width]);
  const baseGeom = useMemo(() => new THREE.PlaneGeometry(bW, bH, 1, joints).translate(0, bH / 2, 0), [bH, bW, joints]);
  noise.magFilter = THREE.NearestFilter;
  noise.minFilter = THREE.NearestFilter;
  const animationStore = useAnimationStore();
  const [initialTime, setInitialTime] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (animationStore.stage === 2) {
      if (initialTime === 0) {
        setInitialTime(time);
      } else if (time - initialTime <= 1 ) {
        const scalar = 1 * ((time - initialTime) / 1);
        materialRef.current.uniforms.flicker.value = scalar
      }
      else if (materialRef.current && props.lightRef.current && time - initialTime >= 1) {
        const flickerIntensity = props.lightRef.current.value;
        materialRef.current.uniforms.flicker.value = flickerIntensity;
      }
    }

    materialRef.current.uniforms.time.value = time / 4;
  });
  return (
    <group position={[0, -0.7, 0]} {...props}>
      <mesh scale={0.2}>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
        >
          <instancedBufferAttribute attach={'attributes-offset'} args={[new Float32Array(attributeData.offsets), 3]} />
          <instancedBufferAttribute
            attach={'attributes-orientation'}
            args={[new Float32Array(attributeData.orientations), 4]}
          />
          <instancedBufferAttribute
            attach={'attributes-stretch'}
            args={[new Float32Array(attributeData.stretches), 1]}
          />
          <instancedBufferAttribute
            attach={'attributes-halfRootAngleSin'}
            args={[new Float32Array(attributeData.halfRootAngleSin), 1]}
          />
          <instancedBufferAttribute
            attach={'attributes-halfRootAngleCos'}
            args={[new Float32Array(attributeData.halfRootAngleCos), 1]}
          />
          <instancedBufferAttribute attach={'attributes-shade'} args={[new Float32Array(attributeData.shade), 1]} />
        </instancedBufferGeometry>
        <grassMaterial
          shade={attributeData.shade}
          ref={materialRef}
          map={texture}
          alphaMap={alphaMap}
          toneMapped={false}
          noiseMap={noise}
        />
      </mesh>
    </group>
  );
}

function getAttributeData(width) {
  const numClusters = 3000;
  const instances = 300000;
  const clusterRadius = 1;

  const offsets = [];
  const orientations = [];
  const stretches = [];
  const halfRootAngleSin = [];
  const halfRootAngleCos = [];
  const shade = [];

  let quaternion_0 = new THREE.Vector4();
  let quaternion_1 = new THREE.Vector4();

  const createClusters = () => {
    const exclusionBaseRadius = 4.5;
    const noiseAmplitude = 0.5;
    const noiseFrequency = 10;
    const clusters = [];

    for (let i = 0; i < numClusters; i++) {
      let validPositionFound = false;
      while (!validPositionFound) {
        const clusterX = (Math.random() - 0.5) * width;
        const clusterZ = (Math.random() - 0.5) * width;

        const distanceFromCenter = Math.sqrt(clusterX ** 2 + clusterZ ** 2);
        const angle = Math.atan2(clusterZ, clusterX);
        const noise = Math.sin(angle * noiseFrequency) * noiseAmplitude;
        const exclusionRadius = exclusionBaseRadius + noise;

        if (distanceFromCenter >= exclusionRadius && clusterX > -20) {
          clusters.push({ clusterX, clusterZ });
          validPositionFound = true;
        }
      }
    }

    return clusters;
  };

  const getPositions = () => {
    const cluster = clusters[Math.floor(Math.random() * clusters.length)];

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * clusterRadius;

    const xPos = cluster.clusterX + Math.cos(angle) * radius;
    const zPos = cluster.clusterZ + Math.sin(angle) * radius;

    return { xPos, zPos };
  };
  const clusters = createClusters();
  //The min and max angle for the growth direction (in radians)
  const min = -0.25;
  const max = 0.25;

  //For each instance of the grass blade
  for (let i = 0; i < instances; i++) {
    //Offset of the roots
    const { xPos, zPos } = getPositions();
    const offsetY = 0;
    offsets.push(xPos * 4, offsetY, zPos * 4);

    //Define random growth directions
    //Rotate around Y
    let angle = Math.PI - Math.random() * (2 * Math.PI);
    halfRootAngleSin.push(Math.sin(0.5 * angle));
    halfRootAngleCos.push(Math.cos(0.5 * angle));

    //Calculate Shade Value
    const distanceFromCenter = Math.sqrt(xPos ** 2 + zPos ** 2);
    const shadeValue = Math.max(0.05, Math.min(0.6, 1.0 - distanceFromCenter / (width * 0.4)));
    shade.push(shadeValue*0.03);

    let RotationAxis = new THREE.Vector3(0, 1, 0);
    let x = RotationAxis.x * Math.sin(angle / 2.0);
    let y = RotationAxis.y * Math.sin(angle / 2.0);
    let z = RotationAxis.z * Math.sin(angle / 2.0);
    let w = Math.cos(angle / 2.0);
    quaternion_0.set(x, y, z, w).normalize();

    //Rotate around X
    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(1, 0, 0);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    //Rotate around Z
    angle = Math.random() * (max - min) + min;
    RotationAxis = new THREE.Vector3(0, 0, 1);
    x = RotationAxis.x * Math.sin(angle / 2.0);
    y = RotationAxis.y * Math.sin(angle / 2.0);
    z = RotationAxis.z * Math.sin(angle / 2.0);
    w = Math.cos(angle / 2.0);
    quaternion_1.set(x, y, z, w).normalize();

    //Combine rotations to a single quaternion
    quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

    orientations.push(quaternion_0.x, quaternion_0.y, quaternion_0.z, quaternion_0.w);

    //Define variety in height
    if (i < instances / 3) {
      stretches.push(Math.random() * 1.8);
    } else {
      stretches.push(Math.random());
    }
  }

  return {
    offsets,
    orientations,
    stretches,
    halfRootAngleCos,
    halfRootAngleSin,
    shade,
  };
}

function multiplyQuaternions(q1, q2) {
  const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
  const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
  const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
  const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
  return new THREE.Vector4(x, y, z, w);
}
