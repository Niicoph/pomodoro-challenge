import { CycleType } from './timer'

export interface SessionRecord {
  id: string
  cycleType: CycleType
  durationSeconds: number
  completedAt: string
}

export type TimePeriod = 'today' | 'last7days' | 'last28days'

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  today: 'Today',
  last7days: 'Last 7 days',
  last28days: 'Last 28 days',
}

export interface DailyFocusData {
  date: string
  focusMinutes: number
}

export interface StatisticsSummary {
  totalFocusMinutes: number
  focusSessions: number
  totalBreakMinutes: number
}
