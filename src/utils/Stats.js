import React, { useEffect, useRef } from 'react';
import Stats from 'stats.js';

const StatsComponent = () => {
  const statsRef = useRef(null);

  useEffect(() => {
    // Initialize stats.js
    const stats = new Stats();
    stats.showPanel(0); // 0: FPS, 1: MS, 2: Memory

    // Attach the stats panel to the DOM
    statsRef.current.appendChild(stats.dom);

    // Function to update stats in every frame
    const animate = () => {
      stats.begin(); // Start measuring
      stats.end();   // End measuring
      requestAnimationFrame(animate); // Keep updating
    };

    // Start the animation loop for stats
    requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return <div ref={statsRef} />;
};

export default StatsComponent;
