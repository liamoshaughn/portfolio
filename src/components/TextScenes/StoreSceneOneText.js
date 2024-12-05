import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAnimationStore, useUtilityStore } from '../../store/store';

export default function StoreSceneOneText() {
  const store = useAnimationStore();
  const utilStore = useUtilityStore();

  // State to track the number of items in the cart
  const [cartCount, setCartCount] = useState(0);

  const textSpring = useSpring({
    opacity: (store.stage === 3 && !store.moving) || (store.stage>=4) ? 1 : 0,
    config: { duration: 1500 },
  });


  // Function to handle adding an item to the cart
  const handleAddToCart = () => {
    setCartCount(cartCount + 1); // Increment cart count
  };

  return (
    <animated.div style={{ ...textSpring, fontFamily: 'Inter' }}>
      {store.stage >= 3 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            paddingTop: '40px',
            paddingLeft: utilStore.aspectRatio >= 1.5 ? '60px': '30px',
            display: 'flex',
            width: '100%',
          }}
        >
          <h3 style={{  fontWeight: 'bold', fontStyle: 'italic', margin: 0 }}>
            WEBSTORE
          </h3>
          {utilStore.aspectRatio >= 1.5 && <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginRight: '80px',
              gap: '20px',
              fontStyle: 'italic',
              fontWeight: '900',
              alignItems: 'center',
              width: '400px',
            }}
          >
            <p style={{  }}>STORE</p>
            <p style={{  }}>ABOUT</p>
            <p style={{  }}>CONTACT</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{  }}>CART {cartCount > 0 && `( ${cartCount} )`} </p>
            </div>
          </div>}
        </div>
      )}
      {store.stage >= 3 && (
        <div
          style={{
            position: 'absolute',
            bottom: utilStore.aspectRatio >= 1.5 ? '32%' : 0,
            right: '10vw',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {utilStore.aspectRatio >=1.5 && <svg
            width="600px"
            height="300px"
            viewBox="0 0 300 150"
            style={{
              borderRadius: '10px',
              overflow: 'visible',
            }}
          >
            <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" fill="none" stroke="black" strokeWidth="1" />
          </svg>}
          <div
            style={{
              position: utilStore.aspectRatio >= 1.5 ? 'absolute' : 'static',
              top: '20px',
              left: '5%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '90%',
              height: '30vh',
              paddingLeft: utilStore.aspectRatio >= 1.5 ? '0px': '25px',
            }}
          >
            <h6 style={{ fontWeight: 'bold', fontStyle: 'italic', margin: '0 10px' }}>
              YOUR PRODUCT HERE
            </h6>
            <p style={{  margin: '0 10px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>$29.99</span>
              <svg
                width="140"
                height="50"
                viewBox="0 0 140 50"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  overflow: 'visible',
                }}
                onClick={handleAddToCart} // Increment cart count
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.querySelector('rect'); // Use e.currentTarget
                  if (rect) rect.setAttribute('fill', '#333333'); // Invert fill color
                  const text = e.currentTarget.querySelector('text'); // Use e.currentTarget
                  if (text) text.setAttribute('fill', '#ffffff'); // Invert text color
                }}
                onMouseLeave={(e) => {
                  const rect = e.currentTarget.querySelector('rect'); // Use e.currentTarget
                  if (rect) rect.setAttribute('fill', 'transparent'); // Reset fill color
                  const text = e.currentTarget.querySelector('text'); // Use e.currentTarget
                  if (text) text.setAttribute('fill', '#333333'); // Reset text color
                }}
              >
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="50"
                  rx="10"
                  ry="10"
                  fill="transparent"
                  stroke="#333333"
                  strokeWidth="1"
                />
                <text
                  x="70"
                  y="30"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="bold"
                  fontSize="16"
                  fill="#333333"
                  alignmentBaseline="middle"
                >
                  Add to Cart
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </animated.div>
  );
}
