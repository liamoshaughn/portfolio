import { useEffect } from 'react';
import { useUtilityStore } from '../store/store';

export function SpeedTest() {
  const store = useUtilityStore();
  const initialTime = new Date().getTime();
  const imageUrl = 'logo512.png';
  const imageSize = 125
  // useEffect(() => {
  //   const time = new Date().getTime();
  //   const timeElapsed = time - initialTime;
  //   if(125 / timeElapsed < store.internetSpeed && 125 / timeElapsed  !== 0 ){
  //       store.setInternetSpeed(125 / timeElapsed)
  //       store.setLoadTime(process.env.REACT_APP_FILE_SIZE / (125 / timeElapsed))
  //   }

  // }, []);

  useEffect(() => {
    MeasureConnectionSpeed();
  }, []);

  const MeasureConnectionSpeed = () => {
    var startTime, endTime;
    var download = new Image();
    startTime = new Date().getTime();
    var cacheBuster = '?nnn=' + startTime;
    download.src = imageUrl + cacheBuster;

    download.onload = function (d) {
      endTime = new Date().getTime();
      
      const timeElapsed = (endTime - startTime)/10;
      if (imageSize / timeElapsed < store.internetSpeed && imageSize / timeElapsed !== 0) {
        store.setInternetSpeed(imageSize / timeElapsed);
        store.setLoadTime(process.env.REACT_APP_FILE_SIZE / (imageSize/ timeElapsed));
      }
    };
  };

  return (
    <div style={{ color: 'red', position: 'absolute', top: 10, left: 100, zIndex: 10 }}>
      <h5>
        Internet Speed:{store.internetSpeed} Load Time: {store.estimatedLoadTime}{' '}
      </h5>
    </div>
  );
}
