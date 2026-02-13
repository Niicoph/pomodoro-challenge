import { CycleType } from './timer'

export interface NotificationSettings {
  audioEnabled: boolean
  browserEnabled: boolean
}

export interface NotificationState {
  isVisible: boolean
  message: string
  suggestion: string
  cycleType: CycleType | null
}

export const COMPLETION_MESSAGES: Record<CycleType, string> = {
  work: 'Work session complete! Time for a break.',
  shortBreak: 'Short break complete! Back to work.',
  longBreak: 'Long break complete! Ready for a new session.',
}

export const NEXT_CYCLE_SUGGESTIONS: Record<CycleType, string> = {
  work: 'Start your short break',
  shortBreak: 'Start your next work session',
  longBreak: 'Start a fresh work session',
}
