import { useRef, useState,useEffect } from 'react';
import {
  Backdrop,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
  PresentationControls,
  useScroll,
} from '@react-three/drei';
import { Pig } from '../Assets/ForYou/Pig';
import Lights from './Lights';
import Props from './Props';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import StoreSceneOneText from '../TextScenes/StoreSceneOneText';
import { useAnimationStore, useUtilityStore } from '../../store/store';
import { useLenis } from 'lenis/react';
import * as d3Ease from 'd3-ease'; 

function SceneForYou(props) {
  const three = useThree();

  const pigRef = useRef();
  const groupRef = useRef();
  const stageRef = useRef();
  const store = useAnimationStore();
  const utilStore = useUtilityStore();
  const { gl } = useThree();
  const [initialTime, setInitialTime] = useState(0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const amplitude = 0.03;
    const frequency = 1.5;
    const position =   utilStore.aspectRatio >= 1.5 ? 1: 1.2
    if (pigRef.current) {
      pigRef.current.position.y = position + Math.sin(time * frequency) * amplitude;
    }

    function clamp(number, min, max) {
      return Math.max(min, Math.min(number, max));
    }
    if(store.stage === 3 && !store.moving ) {
        if (initialTime === 0) {
          setInitialTime(time);
        } else if ( stageRef.current.opacity !== 1  && stageRef.current) {
          stageRef.current.opacity = clamp(1 * ((time - initialTime) / 2),0,1)
          groupRef.current.scale.x= 0
          groupRef.current.scale.y= 0
          groupRef.current.scale.z= 0
          
        } else if (groupRef.current &&  stageRef.current.opacity === 1 ){
          
          groupRef.current.scale.x= 1
          groupRef.current.scale.y= 1
          groupRef.current.scale.z= 1
        }
    } else if(store.stage === 2 && stageRef.current){
      stageRef.current.opacity = 0
      setInitialTime(0)
    }
    if(store.stage ===  4){
      stageRef.current.opacity = 1
    }
    
  });

  useLenis(
    ({ scroll }) => {
      const offset = scroll / 3000;
      const easedProgress = d3Ease.easeExpOut(offset); 
      const reverseOffset = offset - 1;
      const RevEasedProgress = reverseOffset 
      if (store.stage === 3 && !store.moving) {
        three.camera.fov = 70
        if (offset <= 1) {
          three.camera.position.set(1 + 17 * easedProgress, 0.15 + 9.85 * easedProgress, 2 + 5 * easedProgress);
          three.camera.rotation.set(-1.3 * easedProgress, 1.1 * easedProgress, 1.2 * easedProgress);
        } else if(reverseOffset <= 1){
          three.camera.position.set(18 - 17 * RevEasedProgress, 10 - 9.85 * RevEasedProgress, 7 - 5 * RevEasedProgress);
          three.camera.rotation.set(-1.3 * (1 - RevEasedProgress), 1.1 * (1 - RevEasedProgress), 1.2 * (1 - RevEasedProgress));
        }  
        three.camera.updateProjectionMatrix();
      }
    },
    [store.stage, store.moving]
  );
  
  useEffect(()=>{
    if(!store.moving){
      setInitialTime(0);
    }
  },[store.moving])

  return (
    <group  position={[0, -0.8, 0]} {...props}>
     {store.stage === 3 && !store.moving && (
        <group scale={0} ref={groupRef}>
            <Lights />
          <Props />

         {/* <mesh position={[0, 0, 10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[28, 10]} />
            <MeshReflectorMaterial
              blur={[400, 300]}
              resolution={512}
              mixBlur={2}
              mixStrength={5}
              depthScale={1}
              minDepthThreshold={0.75}
              color="#151515"
              metalness={0.6}
              roughness={1}
            />
          </mesh> */}
          <mesh position={[0, -0.10, 0]} rotation={[-Math.PI / 2,0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color={'#0d0f0f'} />
          </mesh>
          <mesh position={[0, 14, 0]} rotation={[-Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color={'black'} />
          </mesh>
        </group>
      )} 
      <Backdrop scale={[30, 10, 5]} floor={1.5} position={[0, 0, -5]}>
        <meshStandardMaterial ref={stageRef} transparent={true} opacity={0} roughness={1} color="#fafafa" />
      </Backdrop>
      <rectAreaLight scale={[20, 10, 10]} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      <group position={utilStore.aspectRatio >= 1.5 ? [0, 1, 0] : [1.2,1,-1]} ref={pigRef}>
        <PresentationControls
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Pig rotation={utilStore.aspectRatio >= 1.5 ? [0, 0.3, 0] : [0.1,0,0]} />
        </PresentationControls>
      </group>
      <ContactShadows position={[0, 0.1, 0]} opacity={1} scale={10} blur={2} far={1.3} />
      <Html
        portal={{ current: gl.domElement.parentNode }}
        scale={0.3}
        style={{ width: '100vw', height:'100dvh' }}
        transform
        position={[1, 1, -2.8]}
      >
        <StoreSceneOneText />
      </Html>
    </group>
  );
}

export default SceneForYou;
