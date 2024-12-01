import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore } from '../../store/store';

export default function CampText() {
  const store = useAnimationStore();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const textSpring = useSpring({
    opacity: loadingComplete ? 0 : 1, 
    config: { duration: 1000 },
    onRest: () => {
      if (loadingComplete) {
        setButtonVisible(true); 
      }
    },
  });

  // Button fade-out animation
  const buttonSpring = useSpring({
    opacity: buttonClicked ? 0 : 1, 
    config: { duration: 1000 },
    onRest: () => {
      if (buttonClicked) {
        setButtonVisible(false);  // Hide the button after fade-out
      }
    },
  });

  // Handle button click
  const handleClick = () => {
    console.log('Button clicked');
    setButtonClicked(true); 
    store.increment();
  };

  useEffect(() => {
    if (store.loadingProgress >= 100) {
      setLoadingComplete(true);
    }
  }, [store.loadingProgress]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30vh',
        width: '100vw',
        justifyContent: 'center',
        display: 'flex',
        color: 'white',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {!buttonVisible && store.stage === 0 && (
        <animated.h1
          style={{
            ...textSpring,
            fontFamily: 'ITC Serif Gothic',
            fontSize: '50px',
            margin: 0,
            position:'absolute'
          }}
        >
          Loading: {store.loadingProgress}%
        </animated.h1>
      )}

      {buttonVisible && !buttonClicked && (
        <animated.button
          onClick={handleClick}
          style={{
            ...buttonSpring,
            position: 'absolute',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '10px',
            padding: '20px 40px',
            fontFamily: 'ITC Serif Gothic',
            fontSize: '40px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 8px 20px rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
          }}
        >
          Enter
        </animated.button>
      )}
    </div>
  );
}
