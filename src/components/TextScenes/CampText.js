import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore } from '../../store/store';

export default function CampText() {
  const store = useAnimationStore();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const loadingSpring = useSpring({
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
        setButtonVisible(false);
      }
    },
  });

  const textSpring = useSpring({
    opacity: store.stage === 2 ? 1 : 0,
    config: { duration: 1500 },
  });

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
    <div style={{ fontFamily: 'ITC Serif Gothic', color: 'white' }}>
      <div
        style={{
          position: 'absolute',
          bottom: '30dvh',
          width: '100vw',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!buttonVisible && store.stage === 0 && (
          <animated.h3
            style={{
              ...loadingSpring,
              position: 'absolute',
            }}
          >
            Loading: {store.loadingProgress}%
          </animated.h3>
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
      {store.stage < 1 && (
        <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          margin: 0,
          color: 'white',
        }}
      >
        <p style={{ ...textSpring }}>Work in progress! Some parts of the website are unoptimised and unstable</p>
      </div>
      )}
      {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 20,
            margin: 0,
            color: 'white',
          }}
        >
          <animated.h1 style={{ ...textSpring, fontWeight: 'bold' }}>Liam O'Shaughnessy</animated.h1>
          <animated.h6 style={{ ...textSpring }}>Software Engineer</animated.h6>
        </div>
      )}
      {store.stage === 2 && (
        <div
          onClick={handleClick}
          style={{
            position: 'absolute',
            bottom: '49dvh',
            right: 'calc(49vw - 100px)',
            margin: 0,
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '10px',
            padding: '10px 20px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
            minWidth:"200px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <animated.p style={{ ...textSpring, fontWeight: 'bold' }}>What I can do for you</animated.p>
        </div>
      )}
      {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            bottom: '10dvh',
            right: 20,
            margin: 0,
            color: 'white',
            width: '85%',
            maxWidth: '600px',
            background: "rgba(0,0,0,40%)",
            padding: "10px",
            paddingRight:"0px",
            paddingLeft:'20px',
            paddingBottom:'13px',
            borderRadius: "10px"
          }}
        >
          <animated.p style={{ ...textSpring, fontWeight: 'bold' }}>
            Hi, I’m a Fullstack Software Engineer who loves building things that matter. Whether it’s designing intuitive interfaces or solving tricky backend problems, I’m passionate about creating solutions that feel seamless and make life a little better. Always learning, always coding, always improving.
          </animated.p>
        </div>
      )}
    </div>
  );
}
