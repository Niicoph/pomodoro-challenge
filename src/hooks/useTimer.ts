import { useState, useEffect, useCallback, useRef } from 'react';
import { CycleType, CYCLE_DURATIONS, TimerState, TimerActions } from '../types/timer';

export function useTimer(): TimerState & TimerActions {
  const [timeRemaining, setTimeRemaining] = useState(CYCLE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState<CycleType>('work');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(CYCLE_DURATIONS[currentCycle]);
  }, [currentCycle]);

  const switchCycle = useCallback((cycle: CycleType) => {
    setIsRunning(false);
    setCurrentCycle(cycle);
    setTimeRemaining(CYCLE_DURATIONS[cycle]);
  }, []);

  return {
    timeRemaining,
    isRunning,
    currentCycle,
    start,
    pause,
    reset,
    switchCycle,
  };
}
