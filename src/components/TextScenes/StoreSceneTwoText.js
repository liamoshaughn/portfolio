import { useState, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { Canvas, useThree } from '@react-three/fiber';
import { Mobile } from '../Assets/ForYou/Mobile';
import { Environment, Html, useHelper } from '@react-three/drei';
import { Box, Flex, Debug } from '@react-three/flex';
import { Laptop } from '../Assets/ForYou/Laptop';
import { useAnimationStore } from '../../store/store';
import { BoxHelper } from 'three';

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


function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function ThreeScene() {
  const store = useAnimationStore();
  const three = useThree();
  const flexRef = useRef();
  const boxRef = useRef();
  const modelRef = useRef();

  // useHelper(flexRef, BoxHelper, 'cyan');
  // useHelper(boxRef, BoxHelper, 'red');
  // useHelper(modelRef, BoxHelper, 'green');

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
          console.log(-1*(window.innerWidth/1500))
          three.camera.position.set(-0.5, -40 * offset, 6);
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
      justify="flex-center"
      alignItems="stretch"
      size={[unitWidth, unitHeight, 0]}
      padding={1}
      scale={window.innerHeight/1000}
    >
      <Box
        dir="row"
        justifyContent="center"
        alignItems="center"
        size={[unitWidth / 2, unitHeight / 4, 0]}
        flexWrap="wrap-reverse"
        for
        now
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={0} />
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
        <Box  margin={0} centerAnchor>
          <Mobile  scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
      <Box
        dir="row"
        justify="center"
        alignItems="center"
        size={[unitWidth/2, unitHeight / 4, 0]}
        flexWrap="wrap"
        ref={boxRef}
        marginTop ={-1.5}
      >
        <Box ref={modelRef} margin={1} centerAnchor>
          <Laptop scale={4} position={[0, -1, 0]} rotation={[1, -Math.PI / 2, 0]} />
        </Box>
        <Box centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={0} />
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
        justifyContent="center"
        alignItems="center"
        size={[unitWidth / 2, unitHeight / 4, 0]}
        flexWrap="wrap-reverse"
        for
        now
        margin ={0}
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={0} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>E-COMMERCE</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                In today’s digital marketplace, your store should be open 24/7—no limits, no borders. I build fast, secure, and scalable e-commerce platforms that turn visitors into customers. Whether you need a sleek Shopify store, a custom WooCommerce solution, or a high-performance headless setup, I’ll create a seamless shopping experience that drives sales.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
        <Box margin={0} centerAnchor>
          <Mobile scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
    <Box
        dir="row"
        justify="center"
        alignItems="center"
        size={[unitWidth/2, unitHeight / 4, 0]}
        flexWrap="wrap"
        ref={boxRef}
        marginTop ={-1.5}
      >
        <Box margin={1} centerAnchor>
          <Laptop scale={4} position={[0, -1, 0]} rotation={[1, -Math.PI / 2, 0]} />
        </Box>
        <Box centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={0} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>CMS</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                Your content deserves a home that’s as dynamic as your ideas. I develop custom Content Management Systems (CMS) that put you in control—no coding required. From WordPress to headless architectures, I build platforms that make publishing effortless, so you can focus on what matters: your business
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
      </Box>
        <Box
       dir="row"
       justifyContent="center"
       alignItems="center"
       size={[unitWidth / 2, unitHeight / 4, 0]}
       flexWrap="wrap-reverse"
       for
       now
       margin = {0}
      >
        <Box margin={1} centerAnchor>
          <mesh>
            <boxGeometry args={[5, 3, 1]} />
            <meshBasicMaterial transparent opacity={0} />
            <Html position={[0, 0, 0.6]} scale={0.1} transform>
              <div style={textStyle}>
                <h6 style={{ fontStyle: 'italic', margin: 0 }}>BLOCKCHAIN?</h6>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                Sure, why not—can’t be that hard. Need a smart contract that also makes coffee? An AI poet trained on your tweets? A website that runs on a potato? Tech stacks come and go, but bad ideas are forever—let’s build yours.
                </p>
              </div>
            </Html>
          </mesh>
        </Box>
        <Box centerAnchor>
          <Mobile scale={1} rotation={[Math.PI / 2, -Math.PI / 2, 0]} />
        </Box>
      </Box>
    </Flex>
  );
}
export default function StoreSceneTwoText() {
  const [offset, setOffset] = useState(0);
  const store = useAnimationStore();



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
                transform: `translateX(${clamp(-100 + 100 * offset, -100, -10)}%)`,
                fontStyle: 'italic',
                padding: '15px',
                textAlign: 'center',
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
                transform: `translateX(${clamp(100 - 100 * (offset - 1) * 1.5, 10, 100)}%)`,
                fontStyle: 'italic',
                padding: '15px',
                textAlign: 'center',
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
