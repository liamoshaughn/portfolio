import { useRef, useState } from 'react';
import {
  Backdrop,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
  PresentationControls,
  useScroll,
} from '@react-three/drei';
import { Pig } from '../CampScene/Assets/ForYou/Pig';
import Lights from './Lights';
import Props from './Props';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import StoreSceneOneText from '../TextScenes/StoreSceneOneText';
import { useAnimationStore } from '../../store/store';
import { useLenis } from 'lenis/react';

function SceneForYou(props) {
  const three = useThree();

  const pigRef = useRef();
  const groupRef = useRef();
  const stageRef = useRef();
  const store = useAnimationStore();
  const { gl } = useThree();
  const [initialTime, setInitialTime] = useState(0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const amplitude = 0.03;
    const frequency = 1.5;
    if (pigRef.current) {
      pigRef.current.position.y = 1 + Math.sin(time * frequency) * amplitude;
    }
    if(store.stage === 3 && !store.moving && store.restState === 2) {
      if(stageRef.current && groupRef.current){
        console.log(groupRef)
        if (initialTime === 0) {
          setInitialTime(time);
        } else if (time - initialTime <= 2) {
          stageRef.current.opacity = 1 * ((time - initialTime) / 2);
        } else if (time - initialTime-2 >= 0){
          groupRef.current.scale.x= 1
          groupRef.current.scale.y= 1
          groupRef.current.scale.z= 1
        }
      }
    }
    
  });

  const lenis = useLenis(
    ({ scroll }) => {
      const offset = scroll / 1500;

      if (store.restState === 2 && store.stage === 3 && !store.moving && offset <= 1) {
        three.camera.position.set(1 + 17 * offset, 0.15 + 9.85 * offset, 2 + 5 * offset);
        three.camera.rotation.set(-1.3 * offset, 1.1 * offset, 1.2 * offset);
      }
    },
    [store.stage, store.restState]
  );

  return (
    <group  position={[0, -0.8, 0]} {...props}>
      {store.stage === 3 && !store.moving && (
        <group scale={0} ref={groupRef}>
          <Lights />
          <Props />

          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[400, 300]}
              resolution={1024}
              mixBlur={2}
              mixStrength={5}
              depthScale={1}
              minDepthThreshold={0.75}
              color="#151515"
              metalness={0.6}
              roughness={1}
            />
          </mesh>
          <mesh position={[0, 14, 0]} rotation={[-Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color={'black'} />
          </mesh>
        </group>
      )}
      <Backdrop scale={[30, 10, 5]} floor={1.5} position={[0, 0, -5]}>
        <meshStandardMaterial ref={stageRef} transparent={true} opacity={0} roughness={1} color="#fafafa" />
      </Backdrop>
      <rectAreaLight scale={[20, 10, 10]} position={[0, 10, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      <group position={[0, 1, 0]} ref={pigRef}>
        <PresentationControls
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Pig rotation={[0, 0.3, 0]} />
        </PresentationControls>
      </group>
      <ContactShadows position={[0, 0.1, 0]} opacity={1} scale={10} blur={2} far={1.3} />
      <Html
        portal={{ current: gl.domElement.parentNode }}
        scale={0.3}
        style={{ width: '100vw' }}
        transform
        position={[0.7, 4.5, -3]}
      >
        <StoreSceneOneText />
      </Html>
    </group>
  );
}

export default SceneForYou;
