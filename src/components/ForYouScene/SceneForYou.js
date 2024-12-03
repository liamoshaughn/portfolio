import { Backdrop, ContactShadows, Environment, MeshReflectorMaterial } from '@react-three/drei';
import { Pig } from '../CampScene/Assets/ForYou/Pig';
import { Scaffold } from '../CampScene/Assets/ForYou/Scaffold';
import Lights from './Lights';
import { StackedBoxes } from '../CampScene/Assets/ForYou/StackedBoxes';
import { Curtains } from '../CampScene/Assets/ForYou/Curtains';
import Props from './Props';

function SceneForYou(props) {
  return (
    <group position={[0, -0.8, -1000]} {...props}>
      {/* Backdrop */}
      <Backdrop
        scale={[30, 10, 5]}
        floor={1.5}
        position={[0, 0, -5]} // Adjusted position for larger stage
      >
        <meshPhysicalMaterial roughness={1} color="#efefef" />
      </Backdrop>
      <ContactShadows position={[0, 0.1, 0]} opacity={1} scale={10} blur={1.5} far={0.8} />
      <Pig position={[0, 1, 0]} />
      <Lights />

      <Props />
      <Environment files={'autoshop.exr'} backgroundBlurriness={0.8} background />
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
    </group>
  );
}

export default SceneForYou;
