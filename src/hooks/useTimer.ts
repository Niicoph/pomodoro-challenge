import { useState, useEffect, useCallback, useRef } from 'react'
import { CycleType, CYCLE_DURATIONS, TimerState, TimerActions } from '../types/timer'

export function useTimer(onComplete?: (cycleType: CycleType) => void): TimerState & TimerActions {
  const [timeRemaining, setTimeRemaining] = useState(CYCLE_DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [currentCycle, setCurrentCycle] = useState<CycleType>('work')
  const intervalRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  const currentCycleRef = useRef(currentCycle)

  onCompleteRef.current = onComplete
  currentCycleRef.current = currentCycle

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            onCompleteRef.current?.(currentCycleRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true)
    }
  }, [timeRemaining])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeRemaining(CYCLE_DURATIONS[currentCycle])
  }, [currentCycle])

  const switchCycle = useCallback((cycle: CycleType) => {
    setIsRunning(false)
    setCurrentCycle(cycle)
    setTimeRemaining(CYCLE_DURATIONS[cycle])
  }, [])

  return {
    timeRemaining,
    isRunning,
    currentCycle,
    start,
    pause,
    reset,
    switchCycle,
  }
}
