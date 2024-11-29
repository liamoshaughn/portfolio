import { useEffect } from 'react';
import { useUtilityStore } from '../store/store';

export function SpeedTest() {
  const store = useUtilityStore();
  const initialTime = new Date().getTime();
  useEffect(() => {
    const time = new Date().getTime();
    const timeElapsed = time - initialTime;
    if(125 / timeElapsed < store.internetSpeed && 125 / timeElapsed  !== 0 ){
        store.setInternetSpeed(125 / timeElapsed)
        store.setLoadTime(process.env.REACT_APP_FILE_SIZE / (125 / timeElapsed))
    }
    
  }, []);

  return (
    <img
      alt="If this failed something is wrong"
      style={{ width: '0px', height: '0px', display: 'block' }}
      src="logo512.png"
    />
  );
}

