import React, { useEffect, useState, Suspense } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import { SpeedTest } from './utils/SpeedTest';
import World from './components/World';
import CampText from './components/TextScenes/CampText';

function App() {
  const store = useAnimationStore();
  console.log(store.stage)

  return (
    <div style={{ height: '100vh', background: 'black' }}>
      {/* <SpeedTest /> */}
      <Suspense fallback={null}>
        <World />
      </Suspense>
      <CampText/>
      <StatsComponent />
    </div>
  );
}

export default App;
