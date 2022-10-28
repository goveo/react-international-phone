import { useState } from 'react';

export const useTimer = () => {
  const [prevTime, setPrevTime] = useState<number>();
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  /**
   * @returns a milliseconds difference from the last check() call.
   * On first call returns undefined
   */
  const check = () => {
    const newTime = Date.now();
    const difference = prevTime ? newTime - currentTime : undefined;

    setPrevTime(currentTime);
    setCurrentTime(newTime);

    return difference;
  };

  return {
    check,
  };
};
