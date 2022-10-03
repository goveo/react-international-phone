import { useState } from "react";

export const useTimer = () => {
  const [prevTime, setPrevTime] = useState<number>();
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const check = () => {
    const difference = prevTime ? currentTime - prevTime : undefined;
    setPrevTime(currentTime);
    setCurrentTime(Date.now());

    return difference;
  };

  return {
    check,
  };
};
