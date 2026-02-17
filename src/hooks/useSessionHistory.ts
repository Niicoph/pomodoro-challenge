import { useState, useCallback } from 'react'
import { CycleType } from '../types/timer'
import { SessionRecord, TimePeriod, StatisticsSummary, DailyFocusData } from '../types/statistics'

const STORAGE_KEY = 'pomodoro-session-history'

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveSessions(sessions: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getPeriodStartDate(period: TimePeriod): Date {
  const now = new Date()
  const startOfToday = getStartOfDay(now)

  switch (period) {
    case 'today':
      return startOfToday
    case 'last7days': {
      const d = new Date(startOfToday)
      d.setDate(d.getDate() - 6)
      return d
    }
    case 'last28days': {
      const d = new Date(startOfToday)
      d.setDate(d.getDate() - 27)
      return d
    }
  }
}

function getDayCount(period: TimePeriod): number {
  switch (period) {
    case 'today':
      return 1
    case 'last7days':
      return 7
    case 'last28days':
      return 28
  }
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionRecord[]>(loadSessions)

  const recordSession = useCallback((cycleType: CycleType, durationSeconds: number) => {
    const newRecord: SessionRecord = {
      id: generateId(),
      cycleType,
      durationSeconds,
      completedAt: new Date().toISOString(),
    }
    setSessions((prev) => {
      const updated = [...prev, newRecord]
      saveSessions(updated)
      return updated
    })
  }, [])

  const getStatistics = useCallback(
    (period: TimePeriod): StatisticsSummary => {
      const periodStart = getPeriodStartDate(period)
      const filtered = sessions.filter((s) => new Date(s.completedAt) >= periodStart)

      const workSessions = filtered.filter((s) => s.cycleType === 'work')
      const breakSessions = filtered.filter(
        (s) => s.cycleType === 'shortBreak' || s.cycleType === 'longBreak'
      )

      const totalFocusMinutes =
        Math.round((workSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60) * 10) / 10
      const totalBreakMinutes =
        Math.round((breakSessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60) * 10) / 10

      return {
        totalFocusMinutes,
        focusSessions: workSessions.length,
        totalBreakMinutes,
      }
    },
    [sessions]
  )

  const getDailyFocusData = useCallback(
    (period: TimePeriod): DailyFocusData[] => {
      const periodStart = getPeriodStartDate(period)
      const dayCount = getDayCount(period)

      const dailyMap = new Map<string, number>()
      for (let i = 0; i < dayCount; i++) {
        const d = new Date(periodStart)
        d.setDate(d.getDate() + i)
        dailyMap.set(formatDate(d), 0)
      }

      const workSessions = sessions.filter(
        (s) => s.cycleType === 'work' && new Date(s.completedAt) >= periodStart
      )

      for (const session of workSessions) {
        const dateKey = formatDate(new Date(session.completedAt))
        if (dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + session.durationSeconds / 60)
        }
      }

      const result: DailyFocusData[] = []
      for (let i = 0; i < dayCount; i++) {
        const d = new Date(periodStart)
        d.setDate(d.getDate() + i)
        const dateKey = formatDate(d)
        result.push({
          date: dateKey,
          focusMinutes: Math.round((dailyMap.get(dateKey) ?? 0) * 10) / 10,
        })
      }

      return result
    },
    [sessions]
  )

  return { sessions, recordSession, getStatistics, getDailyFocusData }
}
