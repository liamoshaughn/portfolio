import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore } from '../../store/store';

export default function StoreSceneOne() {
  const store = useAnimationStore();


  const textSpring = useSpring({
    opacity: store.stage === 2 ? 1: 0,
    config: { duration: 1500 },
  });
  


  return (
    <div style={{ fontFamily: 'ITC Serif Gothic', color: 'white' }}>
      {store.stage === 3 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 20,
            margin: 0,
            color: 'white',
          }}
        >
          <animated.h1 style={{...textSpring, fontWeight:'bold'}}>Liam O'Shaughnessy</animated.h1>
          <animated.h6 style={{...textSpring}}>Software Engineer</animated.h6>
        </div>
      )}
            {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            bottom: '10vh',
            right: 20,
            margin: 0,
            color: 'white',
            width: '90%',
            maxWidth: '600px'
          }}
        >
          <animated.p style={{...textSpring, fontWeight:'bold'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </animated.p>
        </div>
      )}
    </div>
  );
}
