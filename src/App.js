import React, { useEffect, useState, Suspense } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import { SpeedTest } from './utils/SpeedTest';
import World from './World';

function App() {
  const store = useAnimationStore();

  const handleClick = () => {
    console.log('click');
    store.increment();
  };
  return (
    <div style={{ height: '100vh', background: 'black' }}>
      {/* <SpeedTest /> */}
      <Suspense fallback={null}>
        <World />
      </Suspense>
      <button onClick={() => handleClick()} style={{ position: 'absolute', bottom: '10vh' }}>
        Press
      </button>
      <StatsComponent />
    </div>
  );
}

export default App;
