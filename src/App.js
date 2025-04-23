import React, { Suspense, useState } from 'react';

import StatsComponent from './utils/Stats';

import { useAnimationStore } from './store/store';

import World from './components/World';
import CampText from './components/TextScenes/CampText';
import StoreSceneOneText from './components/TextScenes/StoreSceneOneText';
import { ReactLenis, useLenis } from 'lenis/react';
import StoreSceneTwoText from './components/TextScenes/StoreSceneTwoText';

import TagManager from 'react-gtm-module';

function App() {
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: 'G-712T7172FL',
    };
    TagManager.initialize(tagManagerArgs);
  }, []);

  const store = useAnimationStore();
  const [render, setRender] = useState(true);
  useLenis(({ scroll }) => {
    if (scroll > 3000 + window.innerHeight) {
      setRender(false);
    }
  });

  return (
    <div style={{ background: 'black' }}>
      {/* <SpeedTest /> */}
      <ReactLenis
        options={{
          infinite: store.stage === 4 ? true : false,
          smooth: true,
          syncTouch: true,
          touchMultiplier: 1.5,
          touchInertiaMultiplier: 10,
        }}
        root
      >
        <div style={{ position: 'absolute', top: 0, height: store.stage >= 3 ? 'calc(6000px + 100dvh' : '100dvh' }}>
          <div style={{ position: 'sticky', top: 0, height: '100dvh', width: '100vw' }}>
            <Suspense fallback={null}>
              <World />
            </Suspense>
            <CampText />
          </div>
        </div>
        {((store.stage === 3 && !store.moving) || store.stage === 4) && <StoreSceneTwoText />}
        <StatsComponent />
      </ReactLenis>
    </div>
  );
}

export default App;
