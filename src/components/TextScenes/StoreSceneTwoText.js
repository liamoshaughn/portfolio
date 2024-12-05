import { useState } from 'react';
import { useLenis } from 'lenis/react';

export default function StoreSceneTwoText() {
  const [opacity, setOpacity] = useState(0); // Initialize opacity with 0
  useLenis(({ scroll }) => {
    const offset = scroll / 1500 - 0.3; // Adjust the divisor to control opacity rate
    setOpacity(Math.min(1, Math.max(0, offset))); // Ensure opacity stays between 0 and 1
  });

  return (
    <div
      style={{
        opacity: opacity, // Correct the opacity assignment
        position: 'fixed',
        height: '200vh',
        zIndex: 10,
      }}
    >
      <h2 style={{ marginTop: '50px', marginLeft: '20px' }}>
        I focus on what's out here
      </h2>
    </div>
  );
}
