import React, { useMemo, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useAnimationStore } from '../store/store';

const cameraPositions = [
  {
    position: [-7.435484847921432, 310, 2.803298358553767],
    rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
    fov: 70,
  },
  {
    position: [-6.435484847921432, 1.283630264703918, 2.803298358553767],
    rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
    fov: 40,  // Example new fov value
  },
];

const smoothConfig = {
    tension: 150,  
    friction: 176,
    precision: 0.0001, 
  };

const CameraWrapper = ({ cameraPosition, cameraRotation, fov }) => {
  const { camera } = useThree();
  
  // Update camera position, rotation, and fov
  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.rotation.set(...cameraRotation);
    camera.fov = fov; // Set fov directly
    camera.updateProjectionMatrix(); // Important: update the projection matrix after changing fov
  }, [camera, cameraPosition, cameraRotation, fov]);

  return null;
};

function AnimateToTarget({ position, rotation, fov }) {

  // Use spring to animate camera position, rotation, and fov
  const s = useSpring({
    position,
    rotation,
    fov,
    config: smoothConfig,
  });

  const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);
  
  return <AnimatedNavigation cameraPosition={s.position} cameraRotation={s.rotation} fov={s.fov} />;
}

export default function CameraAnimated() {
  const { stage } = useAnimationStore();
  const [cameraSettings, setCameraSettings] = useState(cameraPositions[0]);

  useEffect(() => {
    if(cameraPositions[stage]){
          setCameraSettings(cameraPositions[stage]);
    }

  }, [stage]);

  return (
    <AnimateToTarget
      position={cameraSettings.position}
      rotation={cameraSettings.rotation}
      fov={cameraSettings.fov}
    />
  );
}
