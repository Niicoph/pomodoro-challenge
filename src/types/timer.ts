export type CycleType = 'work' | 'shortBreak' | 'longBreak';

export const CYCLE_DURATIONS: Record<CycleType, number> = {
  work: 1500,
  shortBreak: 300,
  longBreak: 900,
};

export const CYCLE_LABELS: Record<CycleType, string> = {
  work: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  currentCycle: CycleType;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchCycle: (cycle: CycleType) => void;
}
