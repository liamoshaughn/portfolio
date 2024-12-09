import React, { useMemo, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useAnimationStore } from '../store/store';

const smoothConfig = {
  tension: 10,
  friction: 10,
  precision: 0.0001,
};

const CameraWrapper = ({ cameraPosition, cameraRotation, fov }) => {
  const { camera } = useThree();

  // Update camera position, rotation, and fov
  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.rotation.set(...cameraRotation);
    camera.far = 700;
    camera.fov = fov; // Set fov directly
    camera.updateProjectionMatrix(); // Important: update the projection matrix after changing fov
  }, [camera, cameraPosition, cameraRotation, fov]);

  return null;
};

function AnimateToTarget({ position, rotation, fov }) {
  const store = useAnimationStore();
  const springProps = useMemo(
    () => ({
      position,
      rotation,
      fov,
      config: smoothConfig,
      onStart: () => store.setMoving(true),
      onRest: () => {
        console.log('Animation at rest for stage:', store.stage);
        store.setRest();
      },
    }),
    [position, rotation, fov, store]
  );

  const s = useSpring({
    ...springProps,
    onChange: ({ value }) => {
      if (
        Math.abs(value.position[0] - position[0]) < 0.1 &&
        Math.abs(value.position[1] - position[1]) < 0.1 &&
        Math.abs(value.position[2] - position[2]) < 0.1 &&
        store.moving
      ) {
        store.setMoving(false);
      }
    },
  });

  const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);

  return <AnimatedNavigation cameraPosition={s.position} cameraRotation={s.rotation} fov={s.fov} />;
}

export default function CameraAnimated() {
  const cameraPositions = [
    {
      position: [-7.435484847921432, 310, 1002.803298358553767],
      rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
      fov: 70,
    },
    {
      position: [-6.435484847921432, 1.283630264703918, 1002.803298358553767],
      rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
      fov: 40,
    },
    {
      position: [-6.435484847921432, 1.283630264703918, 1002.803298358553767],
      rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
      fov: 40,
    },
    { position: [1, 0.15, 2], rotation: [0, 0, 0], fov: 70 },
    {
      position: [-7.435484847921432, 1010, 1002.803298358553767],
      rotation: [-0.3497735397233472, -1.352775510204316, -0.3421314080622057],
      fov: 70,
    },
  ];
  const { stage } = useAnimationStore();
  const [cameraSettings, setCameraSettings] = useState(cameraPositions[stage]);
  

  useEffect(() => {
    if (cameraPositions[stage]) {
      setCameraSettings(cameraPositions[stage]);
    }
  }, [stage]);

  return (
    <AnimateToTarget position={cameraSettings.position} rotation={cameraSettings.rotation} fov={cameraSettings.fov} />
  );
}
