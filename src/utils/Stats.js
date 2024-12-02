import React, { useEffect, useRef } from 'react';
import Stats from 'stats.js';
import { useProgress } from '@react-three/drei';
import { useAnimationStore } from '../store/store';

const StatsComponent = () => {
  const statsRef = useRef(null);
  const { progress } = useProgress();
  const store = useAnimationStore();
  const lastProgressRef = useRef(0);
  

  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0);
    statsRef.current.appendChild(stats.dom);

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const updateProgress = () => {
      const roundedProgress = Math.floor(progress);

      if (roundedProgress > lastProgressRef.current) {
        lastProgressRef.current = roundedProgress;
        store.setLoadingProgress(roundedProgress);
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress, store]);




  return (
    <div ref={statsRef}>
      {/* <div style={{ position: 'absolute', top: '10px', left: '100px', color: 'white', fontSize: '16px' }}>
        {progressText}
      </div> */}
    </div>
  );
};

export default StatsComponent;
