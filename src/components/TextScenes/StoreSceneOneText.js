import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore } from '../../store/store';

export default function StoreSceneOneText() {
  const store = useAnimationStore();

  const textSpring = useSpring({
    opacity: store.stage === 2 ? 1 : 0,
    config: { duration: 1500 },
  });

  return (
    <div style={{ fontFamily: 'Inter', color: 'black' }}>
      {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            paddingTop: '40px',
            paddingLeft: '60px',
            paddingRight: '10vw',
            display: 'flex',
            width: 'calc(90vw - 60px)',
          }}
        >
          <animated.h3 style={{ ...textSpring, fontWeight: 'bold', fontStyle: 'italic', margin: 0 }}>
            WEBSTORE
          </animated.h3>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              gap: '20px',
              fontStyle: 'italic',
              fontWeight: '900',
              alignItems: 'center',
            }}
          >
            <animated.p style={{ ...textSpring }}>STORE</animated.p>
            <animated.p style={{ ...textSpring }}>ABOUT</animated.p>
            <animated.p style={{ ...textSpring }}>CONTACT</animated.p>
            <animated.p style={{ ...textSpring }}>CART</animated.p>
          </div>
        </div>
      )}
      {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            top: '30vh',
            height:'30vh',
            right: '15vw',
            margin: 0,
            width: '30vw',
            padding: '2.5vh',
            borderRadius: '10px',
            border: '1px solid #000',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <animated.h6 style={{ ...textSpring, fontWeight: 'bold', fontStyle: 'italic' }}>
            YOUR PRODUCT HERE
          </animated.h6>
          <animated.p style={{ ...textSpring }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </animated.p>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>$29.99</span>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={() => alert('Added to cart!')}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
