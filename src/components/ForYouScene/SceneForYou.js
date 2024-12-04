import { useRef } from 'react';
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

function SceneForYou(props) {
  const pigRef = useRef();
  const store = useAnimationStore();
  const scroll = useScroll();
  const { gl } = useThree();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const amplitude = 0.03;
    const frequency = 1.5;
    if (pigRef.current) {
      pigRef.current.position.y = 1 + Math.sin(time * frequency) * amplitude;
    }
    const offset = scroll.offset;
    if(store.stage === 3 && !store.moving){
          state.camera.position.x=1+ 17 * offset;
    state.camera.position.y= 0.15 + 9.85 * offset;
    state.camera.position.z =  2 + 5 * offset;
    state.camera.rotation.x= -1.3 * offset
    state.camera.rotation.y= 1.1 * offset;
    state.camera.rotation.z =  1.2 * offset;
    }

  });

  return (
    <group position={[0, -0.8, 0]} {...props}>
      {store.stage === 3 && !store.moving && (
        
        <group>
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

          <Backdrop scale={[30, 10, 5]} floor={1.5} position={[0, 0, -5]}>
            <meshPhysicalMaterial roughness={1} color="#fafafa" />
          </Backdrop>
        </group>
      )}

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
      <Html portal={{current: gl.domElement.parentNode}}scale={0.3} style={{ width: '100vw' }} transform position={[0.7, 4.5, -3]}>
        <StoreSceneOneText />
      </Html>
    </group>
  );
}

export default SceneForYou;
