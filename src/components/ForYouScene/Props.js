import { Backdrop, ContactShadows, Environment } from '@react-three/drei';
import { Pig } from '../CampScene/Assets/ForYou/Pig';
import { Scaffold } from '../CampScene/Assets/ForYou/Scaffold';
import Lights from './Lights';
import { StackedBoxes } from '../CampScene/Assets/ForYou/StackedBoxes';
import { Curtains } from '../CampScene/Assets/ForYou/Curtains';

function Props(props) {
  return (
    <group position={[0, -0.2, 0]} {...props}>
      <Scaffold position={[-1, 0, -1]} scale={3} />
      <StackedBoxes scale={1.6} position={[-8, 0.2, 6]} rotation={[0, -0.6, 0]} />
      <Curtains scale={5} position={[-8, 0, 0]} />
    </group>
  );
}

export default Props;
