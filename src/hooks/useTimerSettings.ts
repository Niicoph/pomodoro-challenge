import { useState, useCallback, useEffect } from 'react'
import {
  TimerSettings,
  DEFAULT_TIMER_SETTINGS,
  TIMER_SETTINGS_BOUNDS,
} from '../types/timer'

const STORAGE_KEY = 'pomodoro-timer-settings'

function clampDuration(value: number): number {
  return Math.max(TIMER_SETTINGS_BOUNDS.min, Math.min(TIMER_SETTINGS_BOUNDS.max, Math.round(value)))
}

function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        workMinutes:
          typeof parsed.workMinutes === 'number'
            ? clampDuration(parsed.workMinutes)
            : DEFAULT_TIMER_SETTINGS.workMinutes,
        shortBreakMinutes:
          typeof parsed.shortBreakMinutes === 'number'
            ? clampDuration(parsed.shortBreakMinutes)
            : DEFAULT_TIMER_SETTINGS.shortBreakMinutes,
        longBreakMinutes:
          typeof parsed.longBreakMinutes === 'number'
            ? clampDuration(parsed.longBreakMinutes)
            : DEFAULT_TIMER_SETTINGS.longBreakMinutes,
      }
    }
  } catch {
    // Corrupted localStorage — fall back to defaults
  }
  return { ...DEFAULT_TIMER_SETTINGS }
}

function saveSettings(settings: TimerSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage full or unavailable
  }
}

export function useTimerSettings() {
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(loadSettings)

  useEffect(() => {
    saveSettings(timerSettings)
  }, [timerSettings])

  const updateTimerSettings = useCallback((partial: Partial<TimerSettings>) => {
    setTimerSettings((prev) => {
      const updated = { ...prev, ...partial }
      return {
        workMinutes: clampDuration(updated.workMinutes),
        shortBreakMinutes: clampDuration(updated.shortBreakMinutes),
        longBreakMinutes: clampDuration(updated.longBreakMinutes),
      }
    })
  }, [])

  return { timerSettings, updateTimerSettings }
}
