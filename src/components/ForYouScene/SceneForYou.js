import { useRef } from 'react';
import { Backdrop, ContactShadows, Html, MeshReflectorMaterial, PresentationControls } from '@react-three/drei';
import { Pig } from '../CampScene/Assets/ForYou/Pig';
import Lights from './Lights';
import Props from './Props';
import { useFrame, useLoader } from '@react-three/fiber';
import StoreSceneOneText from '../TextScenes/StoreSceneOneText';

function SceneForYou(props) {
  const pigRef = useRef();
  

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const amplitude = 0.03;
    const frequency = 0.8;
    if (pigRef.current) {
      pigRef.current.position.y = 1 + Math.sin(time * frequency) * amplitude;
    }
  });

  // const { x, fontSize } = useControls({
  //   x: { value: -2.65, min: -3, max: -1, step: 0.001 },
  //   fontSize: { value: 0.5, min: 0.4, max: 0.6, step: 0.001 },
  // });

  return (
    <group position={[0, -0.8, 0]} {...props}>
      <Backdrop scale={[30, 10, 5]} floor={1.5} position={[0, 0, -5]}>
        <meshPhysicalMaterial roughness={1} color="#efefef" />
      </Backdrop>

      <group position={[0, 1, 0]} ref={pigRef}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Pig rotation={[0, 0.3, 0]} />
        </PresentationControls>
      </group>
      <ContactShadows position={[0, 0.1, 0]} opacity={0.75} scale={20} blur={1} far={1.3} />

      <Lights />
      <Props />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 300]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#151515"
          metalness={0.6}
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 14, 0]} rotation={[-Math.PI / 2, Math.PI, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={'black'} />
      </mesh>


        <Html scale={0.3} style={{width:"100vw"}} transform position={[0.5,4.5,-3]} >

          <StoreSceneOneText />
        </Html>
 
    </group>
  );
}

export default SceneForYou;
