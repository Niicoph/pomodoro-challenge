import { useState, useCallback, useEffect, useRef } from 'react'
import { CycleType } from '../types/timer'
import {
  NotificationSettings,
  NotificationState,
  COMPLETION_MESSAGES,
  NEXT_CYCLE_SUGGESTIONS,
} from '../types/notifications'
import { playNotificationSound } from '../utils/audio'

const STORAGE_KEY = 'pomodoro-notification-settings'
const AUTO_DISMISS_MS = 5000

function loadSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        audioEnabled: typeof parsed.audioEnabled === 'boolean' ? parsed.audioEnabled : true,
        browserEnabled: typeof parsed.browserEnabled === 'boolean' ? parsed.browserEnabled : false,
      }
    }
  } catch {
    // Corrupted localStorage — fall back to defaults
  }
  return { audioEnabled: true, browserEnabled: false }
}

function saveSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage full or unavailable
  }
}

const INITIAL_NOTIFICATION_STATE: NotificationState = {
  isVisible: false,
  message: '',
  suggestion: '',
  cycleType: null,
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings)
  const [notificationState, setNotificationState] = useState<NotificationState>(
    INITIAL_NOTIFICATION_STATE
  )
  const dismissTimerRef = useRef<number | null>(null)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
  }, [])

  const dismissNotification = useCallback(() => {
    clearDismissTimer()
    setNotificationState(INITIAL_NOTIFICATION_STATE)
  }, [clearDismissTimer])

  const triggerNotification = useCallback(
    (cycleType: CycleType) => {
      clearDismissTimer()

      setNotificationState({
        isVisible: true,
        message: COMPLETION_MESSAGES[cycleType],
        suggestion: NEXT_CYCLE_SUGGESTIONS[cycleType],
        cycleType,
      })

      if (settings.audioEnabled) {
        playNotificationSound(cycleType)
      }

      if (settings.browserEnabled && !document.hasFocus() && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(COMPLETION_MESSAGES[cycleType], {
            body: NEXT_CYCLE_SUGGESTIONS[cycleType],
          })
        }
      }

      dismissTimerRef.current = window.setTimeout(() => {
        setNotificationState(INITIAL_NOTIFICATION_STATE)
        dismissTimerRef.current = null
      }, AUTO_DISMISS_MS)
    },
    [settings.audioEnabled, settings.browserEnabled, clearDismissTimer]
  )

  const updateSettings = useCallback((partial: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const requestBrowserPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false
    }
    if (Notification.permission === 'granted') {
      return true
    }
    if (Notification.permission === 'denied') {
      return false
    }
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  useEffect(() => {
    return () => {
      clearDismissTimer()
    }
  }, [clearDismissTimer])

  return {
    settings,
    updateSettings,
    notificationState,
    triggerNotification,
    dismissNotification,
    requestBrowserPermission,
  }
}
