import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore } from '../../store/store';

export default function StoreSceneOneText() {
  const store = useAnimationStore();

  // State to track the number of items in the cart
  const [cartCount, setCartCount] = useState(0);

  const textSpring = useSpring({
    opacity: store.stage === 2 ? 1 : 0,
    config: { duration: 1500 },
  });

  // Function to handle adding an item to the cart
  const handleAddToCart = () => {
    setCartCount(cartCount + 1); // Increment cart count
  };

  return (
    <div style={{ fontFamily: 'Inter', color: '#333333' }}>
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
              width: '400px',
            }}
          >
            <animated.p style={{ ...textSpring }}>STORE</animated.p>
            <animated.p style={{ ...textSpring }}>ABOUT</animated.p>
            <animated.p style={{ ...textSpring }}>CONTACT</animated.p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <animated.p style={{ ...textSpring }}>CART {cartCount > 0 && `( ${cartCount} )`} </animated.p>
            </div>
          </div>
        </div>
      )}
      {store.stage === 2 && (
        <div
          style={{
            position: 'absolute',
            top: '30vh',
            height: '30vh',
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
                  color: '#333333',
                  border: '1px solid #333333',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease', // Smooth transition
                }}
                onClick={handleAddToCart} // Update cart count
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#333333'; // Invert background color
                  e.target.style.color = '#fff'; // Invert text color
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'; // Reset background color
                  e.target.style.color = '#333333'; // Reset text color
                }}
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
