export type CycleType = 'work' | 'shortBreak' | 'longBreak'

export const CYCLE_DURATIONS: Record<CycleType, number> = {
  work: 1500,
  shortBreak: 300,
  longBreak: 900,
}

export const CYCLE_LABELS: Record<CycleType, string> = {
  work: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export interface TimerState {
  timeRemaining: number
  isRunning: boolean
  currentCycle: CycleType
}

export interface TimerActions {
  start: () => void
  pause: () => void
  reset: () => void
  switchCycle: (cycle: CycleType) => void
}

export interface TimerSettings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
}

export const TIMER_SETTINGS_BOUNDS = {
  min: 1,
  max: 120,
}

export function settingsToDurations(settings: TimerSettings): Record<CycleType, number> {
  return {
    work: settings.workMinutes * 60,
    shortBreak: settings.shortBreakMinutes * 60,
    longBreak: settings.longBreakMinutes * 60,
  }
}
