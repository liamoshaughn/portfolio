import { useState } from 'react';
import { useLenis } from 'lenis/react';

export default function StoreSceneTwoText() {
  const [offset, setOffset] = useState(0);

  // Clamp function to restrict values within a range
  function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  // Track scrolling and calculate offset
  useLenis(({ scroll }) => {
    const newOffset = scroll / 1500;
    setOffset(newOffset);
  });

  return (
    <div style={{
      fontFamily: 'Inter',
    }}>
      <div
        style={{
          height: 'calc(3000px + 100vh)',
        }}
      >
        <div style={{ position: 'sticky', top: '0', height: '100vh' }}>
          <div
            style={{
              transform: `translateX(${clamp(-120 + 120 * offset, -100, 0)}vw)`, // Moves faster
              background: 'white',
              width: '100vw',
            }}
          >
            <h4
              style={{
                transform: `translateX(${clamp(-100 + 100 * offset, -100, 0)}%)`, // Moves slower
                fontStyle: 'italic',
                padding: '15px',
                marginLeft: '20px',
              }}
            >
              I FOCUS ON WHAT'S OUT HERE
            </h4>
          </div>

          {/* Banner Moving Right */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              transform: `translateX(${clamp(120 - 120 * (offset - 1) * 1, 0, 100)}vw)`, // Moves faster
              background: 'white',
              width: '100vw',
            }}
          >
            <h4
              style={{
                transform: `translateX(${clamp(100 - 100 * (offset - 1), 0, 100)}%)`, // Moves slower
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
          background: 'linear-gradient(180deg, rgba(255,255,255,1) 2%, rgba(255,181,0,1) 20%, rgba(255,1,141,1) 70%, black 100%)',
          height: '4000px',
        }}
      >
        <div><h4 style={{fontStyle: 'italic'}} >I'LL FIGURE OUT WHAT TO PUT HERE</h4></div>
      </div>
    </div>
  );
}
