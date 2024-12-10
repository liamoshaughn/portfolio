import React, { useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useAnimationStore } from '../store/store';
import * as THREE from 'three';
import * as d3Ease from 'd3-ease'; 

function CameraAnimated() {
  const { camera } = useThree();
  const store = useAnimationStore();

  const cameraPositions = [
    {
      position: [-7.435, 310, 1002.803],
      rotation: [-0.349, -1.352, -0.342],
      fov: 70,
    },
    {
      position: [-6.435, 1.283, 1002.803],
      rotation: [-0.349, -1.352, -0.342],
      fov: 40,
    },
    {
      position: [-6.435, 1.283, 1002.803],
      rotation: [-0.349, -1.352, -0.342],
      fov: 40,
    },
    {
      position: [1, 0.15, 2],
      rotation: [0, 0, 0],
      fov: 70,
    },
    {
      position: [-7.435, 1010, 1002.803],
      rotation: [-0.349, -1.352, -0.342],
      fov: 70,
    },
  ];

  const [cameraSettings, setCameraSettings] = useState(cameraPositions[store.stage]);
  const initialTime = useRef(0);

  useEffect(() => {
    setCameraSettings(cameraPositions[store.stage]);
    initialTime.current = 0; // Reset initial time whenever the store.stage changes
  }, [store.stage]);

  useFrame(({ clock, delta }) => {
    const time = clock.getElapsedTime();
    if (store.stage === 0) {
      camera.position.set(-7.435, 310, 1002.803);
      camera.rotation.set(-0.349, -1.352, -0.342);
      camera.fov = 70;
    } else {
      if (initialTime.current === 0) {
        initialTime.current = time; // Set the initial time on the first frame
      }
      const elapsed = time - initialTime.current;
      const transitionDuration = 6;
      const progress = elapsed / transitionDuration
      if (progress <= 1 && cameraSettings) {
        if(!store.moving){
          store.setMoving(true)
        }
        const easedProgress = d3Ease.easeExpOut(progress); 

        camera.position.set(
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].position[0], cameraSettings.position[0], easedProgress),
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].position[1], cameraSettings.position[1], easedProgress),
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].position[2], cameraSettings.position[2], easedProgress)
        );

        camera.rotation.set(
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].rotation[0], cameraSettings.rotation[0], easedProgress),
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].rotation[1], cameraSettings.rotation[1], easedProgress),
          THREE.MathUtils.lerp(cameraPositions[store.stage-1].rotation[2], cameraSettings.rotation[2], easedProgress)
        );

        // Interpolate fov with easing
        camera.fov = THREE.MathUtils.lerp(cameraPositions[store.stage-1].fov, cameraSettings.fov, easedProgress);

        camera.updateProjectionMatrix();
      } else {
        if(store.moving){
          store.setMoving(false)
        }
      }
    }
  });

  return null;
}

export default CameraAnimated;
