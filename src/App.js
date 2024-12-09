import React, { Suspense, useState } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import World from './components/World';
import CampText from './components/TextScenes/CampText';
import StoreSceneOneText from './components/TextScenes/StoreSceneOneText';
import { ReactLenis, useLenis } from 'lenis/react';
import StoreSceneTwoText from './components/TextScenes/StoreSceneTwoText';

function App() {
  const store = useAnimationStore();
  const [render, setRender] = useState(true)
  useLenis(({scroll})=>{
    if(scroll> 3000+window.innerHeight){
      setRender(false)
    }
  })

  return (
    <div style={{ background: 'black' }}>
      {/* <SpeedTest /> */}
      <ReactLenis options={{infinite:store.stage === 4 ? true : false, smooth: true,}} root>
        <div style={{position:'absolute', top:0, height: store.restState >= 2 ? 'calc(3000px + 100vh' : '100vh'}}>
          <div style={{ position: 'sticky', top:0, height: '100vh', width: '100vw' }}>
            <Suspense fallback={null}>
              <World />
            </Suspense>
            <CampText />
          </div>
        </div>
        {(store.stage === 3 || store.stage ===4 )  && <StoreSceneTwoText />}
        <StatsComponent />
        {/* <StoreSceneTwoText/> */}
      </ReactLenis>
    </div>
  );
}

export default App;
