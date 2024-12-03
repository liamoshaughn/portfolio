import { SoftLightHanging } from '../CampScene/Assets/ForYou/SoftLightHanging';
import React, { useRef, useEffect } from 'react';
import { SpotLightHelper,  } from 'three';
import { useThree } from '@react-three/fiber';
import { RoofLight } from '../CampScene/Assets/ForYou/RoofLight';
import { SoftLightStand } from '../CampScene/Assets/ForYou/SoftLightStand';
import { UmbrellaLight } from '../CampScene/Assets/ForYou/UmbrellaLight';

function Lights(props) {


  return (
    <group position={[0, 0, 0]} {...props}>

      <SoftLightHanging scale={1.5}rotation={[-0.5,Math.PI+0.5,0]}  position={[5, 6.5, 12]} />

      <SoftLightHanging scale={1.5}rotation={[-0.5,Math.PI-0.5,0]}  position={[-4, 6.6, 12]} />
      <RoofLight position={[0,12,0]} />

      <SoftLightStand scale={1.5} rotation={[0,Math.PI, 0]} position={[2,0,10]}/>
        <UmbrellaLight scale={1.5} rotation={[0,Math.PI-0.7, 0]} position={[-10,0,4]}/>
        <UmbrellaLight scale={1.5} rotation={[0,Math.PI+0.7, 0]} position={[2,0,9]}/>
    </group>
  );
}

export default Lights;
