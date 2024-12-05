import React, { Suspense } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import World from './components/World';
import CampText from './components/TextScenes/CampText';
import StoreSceneOneText from './components/TextScenes/StoreSceneOneText';
import { ReactLenis, useLenis } from 'lenis/react';
import StoreSceneTwoText from './components/TextScenes/StoreSceneTwoText';

function App() {
  const store = useAnimationStore();

  return (
    <div style={{ height: store.stage === 3 && !store.moving ? '400vh' : '100vh', background: 'black' }}>
      {/* <SpeedTest /> */}
      <ReactLenis root>
        <div style={{position: 'fixed', height:"100vh", width:'100vw'}}>
          <Suspense fallback={null}>
            <World />
          </Suspense> 
          <CampText />
        </div>      
       {store.stage === 3 && !store.moving &&  <StoreSceneTwoText />}
        <StatsComponent />
      </ReactLenis>
    </div>
  );
}

export default App;
