import { useState, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { Canvas, useThree } from '@react-three/fiber';
import { Mobile } from '../Assets/ForYou/Mobile';
import { Environment, Html, OrbitControls, Text, useAspect } from '@react-three/drei';
import { Box, Flex, Debug } from '@react-three/flex';
import { Laptop } from '../Assets/ForYou/Laptop';
import { useAnimationStore } from '../../store/store';

const textStyle = {
  width: '350px',
  height: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: '10px',
  boxSizing: 'border-box',
  background: 'none',
  transform: 'scale(5)',
};

function ThreeScene() {
  const store = useAnimationStore();
  const three = useThree();
  const flexRef = useRef();

  function pixelToThreeUnits(pixelWidth) {
    const camera = three.camera;
    if (!camera.isPerspectiveCamera) {
      throw new Error('Camera must be a PerspectiveCamera.');
    }

    const distance = camera.position.z;
    const fov = (camera.fov * Math.PI) / 180;
    const unitHeight = 2 * distance * Math.tan(fov / 2);
    const aspect = window.innerWidth / window.innerHeight;
    const unitWidth = unitHeight * aspect;

    return { unitWidth, unitHeight };
  }
  const { unitWidth, unitHeight } = pixelToThreeUnits();

  useLenis(
    ({ scroll }) => {
      const offset = (scroll - (6150 + window.innerHeight)) / 5000;
      if (offset > 0) {
        if (offset <= 1) {
          three.camera.position.set(0, -30 * offset, 5);
        }
      }
    },
    [store.stage]
  );
  return (
    <Flex
      ref={flexRef}
      dir="column"
      position={[-unitWidth / 2, unitHeight / 2, 0]}
      justifyContent="flex-start"
      alignItems="stretch"
      size={[unitWidth, unitHeight, 0]}
      padding={1}
      scale={window.innerHeight/1000}
    >
      <Box
        dir="row"
        justifyContent="flex-start"
        alignItems="center"
        size={[unitWidth / 2, unitHeight / 4, 0]}
        flexWrap="wrap-reverse"
        for
        now
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={1} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>APPS</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  Everyone has a phone, so why not let everyone see you? I design and develop apps that bring your ideas
                  to life. Whether it’s a dynamic business tool, an interactive experience, or a simple way to connect
                  with your audience.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
        <Box margin={1} centerAnchor>
          <Mobile scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
      <Box
        dir="row"
        justifyContent="flex-end"
        alignItems="center"
        size={[unitWidth, unitHeight / 4, 0]}
        flexWrap="wrap"
      >
        <Box margin={1} centerAnchor>
          <Laptop scale={2} rotation={[1, -Math.PI / 2, 0]} />
        </Box>
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={1} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>WEBSITES</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  Everyone has a phone, so why not let everyone see you? I design and develop apps that bring your ideas
                  to life. Whether it’s a dynamic business tool, an interactive experience, or a simple way to connect
                  with your audience.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
      </Box>
      <Box
        dir="row"
        justifyContent="flex-start"
        alignItems="center"
        size={[unitWidth / 2, unitHeight / 4, 0]}
        flexWrap="wrap-reverse"
        for
        now
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={1} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>E-COMMERCE</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  Everyone has a phone, so why not let everyone see you? I design and develop apps that bring your ideas
                  to life. Whether it’s a dynamic business tool, an interactive experience, or a simple way to connect
                  with your audience.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
        <Box margin={1} centerAnchor>
          <Mobile scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
      <Box
        dir="row"
        justifyContent="flex-end"
        alignItems="center"
        size={[unitWidth, unitHeight / 4, 0]}
        flexWrap="wrap"
      >
        <Box margin={1} centerAnchor>
          <Laptop scale={2} rotation={[1, -Math.PI / 2, 0]} />
        </Box>
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={1} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>CMS</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  Everyone has a phone, so why not let everyone see you? I design and develop apps that bring your ideas
                  to life. Whether it’s a dynamic business tool, an interactive experience, or a simple way to connect
                  with your audience.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
      </Box>
      <Box
        dir="row"
        justifyContent="flex-start"
        alignItems="center"
        size={[unitWidth / 2, unitHeight / 4, 0]}
        flexWrap="wrap-reverse"
        for
        now
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={1} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>BLOCKCHAIN?</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  Everyone has a phone, so why not let everyone see you? I design and develop apps that bring your ideas
                  to life. Whether it’s a dynamic business tool, an interactive experience, or a simple way to connect
                  with your audience.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
        <Box margin={1} centerAnchor>
          <Mobile scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
    </Flex>
  );
}
export default function StoreSceneTwoText() {
  const [offset, setOffset] = useState(0);
  const store = useAnimationStore();

  function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  useLenis(({ scroll }) => {
    const newOffset = scroll / 3000;
    setOffset(newOffset);
  });

  return (
    <div
      style={{
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          height: '6000px',
          overflowX: 'clip',
        }}
      >
        <div style={{ position: 'sticky', top: '0', height: '0', opacity: store.stage === 4 ? 0 : 1 }}>
          <div
            style={{
              transform: `translateX(${clamp(-120 + 120 * offset, -120, 0)}vw)`,
              background: 'linear-gradient(-90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 10%)',
              width: '120vw',
              zIndex: 10,
              position: 'absolute',
            }}
          >
            <h4
              style={{
                transform: `translateX(${clamp(-100 + 100 * offset, -100, 0)}%)`,
                fontStyle: 'italic',
                padding: '15px',
                marginLeft: '20px',
              }}
            >
              I FOCUS ON WHAT'S OUT HERE
            </h4>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '-100dvh',
              transform: `translateX(${clamp(120 - 120 * (offset - 1) * 1.5, -20, 100)}vw)`,
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 10%)',
              width: '120vw',
              zIndex: 10,
            }}
          >
            <h4
              style={{
                transform: `translateX(${clamp(100 - 100 * (offset - 1) * 1.5, 0, 100)}%)`,
                fontStyle: 'italic',
                padding: '15px',
                marginRight: '20px',
                textAlign: 'end',
              }}
            >
              SO YOU CAN FOCUS ON WHAT'S IMPORTANT
            </h4>
          </div>
        </div>
      </div>
      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,1) 2%, rgba(255,181,0,1) 20%, rgba(255,1,141,1) 60%, black 90%)',
          height: 'calc(6150px + 100dvh)',
        }}
      >
        <div style={{ height: '5000px', paddingTop: 'calc(150px + 100dvh)' }}>
          <h4 style={{ textAlign: 'center' }}>WHAT I CAN DO FOR YOU</h4>
          {offset > 2 &&  (
            <Canvas style={{ height: '100dvh', position: 'sticky', top: 0 }}>
              <Environment preset="city" />
              <ambientLight intensity={1} />

              <ThreeScene />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}
