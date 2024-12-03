import React, {  Suspense } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import World from './components/World';
import CampText from './components/TextScenes/CampText';
import StoreSceneOneText from './components/TextScenes/StoreSceneOneText';

function App() {
  const store = useAnimationStore();
  console.log(store.stage)

  return (
    <div style={{ height: '100vh', background: 'black' }}>
      {/* <SpeedTest /> */}
      <Suspense fallback={null}>
        <World />
      </Suspense>
      {/* <CampText/> */}
      <StoreSceneOneText/>
      <StatsComponent />
    </div>
  );
}

export default App;
