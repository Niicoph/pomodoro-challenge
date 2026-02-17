import { useState, useCallback, useEffect, useRef } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useNotifications } from '../hooks/useNotifications'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { useTheme } from '../hooks/useTheme'
import { CycleType, CYCLE_DURATIONS } from '../types/timer'
import { THEMES } from '../types/theme'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import CycleSelector from './CycleSelector'
import NotificationBanner from './NotificationBanner'
import NotificationSettings from './NotificationSettings'
import StatisticsModal from './StatisticsModal'

const CYCLE_GRADIENT: Record<CycleType, { background: string }> = {
  work: {
    background:
      'linear-gradient(to bottom right, var(--color-accent-work), var(--color-accent-work-end))',
  },
  shortBreak: {
    background:
      'linear-gradient(to bottom right, var(--color-accent-short-break), var(--color-accent-short-break-end))',
  },
  longBreak: {
    background:
      'linear-gradient(to bottom right, var(--color-accent-long-break), var(--color-accent-long-break-end))',
  },
}

export default function PomodoroTimer() {
  const {
    settings,
    updateSettings,
    notificationState,
    triggerNotification,
    dismissNotification,
    requestBrowserPermission,
  } = useNotifications()

  const { recordSession, getStatistics, getDailyFocusData } = useSessionHistory()
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const { themeName, setTheme } = useTheme()
  const themeDropdownRef = useRef<HTMLDivElement>(null)

  const handleTimerComplete = useCallback(
    (cycleType: CycleType) => {
      triggerNotification(cycleType)
      recordSession(cycleType, CYCLE_DURATIONS[cycleType])
    },
    [triggerNotification, recordSession]
  )

  const { timeRemaining, isRunning, currentCycle, start, pause, reset, switchCycle } =
    useTimer(handleTimerComplete)

  useEffect(() => {
    if (!isThemeOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setIsThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isThemeOpen])

  return (
    <div
      className="min-h-screen transition-all duration-700 flex flex-col items-center justify-center p-4"
      style={CYCLE_GRADIENT[currentCycle]}
    >
      <NotificationBanner
        message={notificationState.message}
        suggestion={notificationState.suggestion}
        cycleType={notificationState.cycleType}
        isVisible={notificationState.isVisible}
        onDismiss={dismissNotification}
      />
      <NotificationSettings
        settings={settings}
        onUpdateSettings={updateSettings}
        onRequestPermission={requestBrowserPermission}
      />
      <div className="fixed top-4 left-4 z-40 flex gap-2">
        <button
          onClick={() => setIsStatsOpen(true)}
          className="p-2.5 rounded-xl active:scale-95 transition-all duration-200"
          style={{
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
          }}
          aria-label="Focus statistics"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
          </svg>
        </button>
        <div ref={themeDropdownRef} className="relative">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="p-2.5 rounded-xl active:scale-95 transition-all duration-200"
            style={{
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Theme selector"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                clipRule="evenodd"
              />
              <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0-1.337-.563h-5.25a1.875 1.875 0 0 0-1.875 1.875v5.25c0 .346.094.668.257.963l1.731-1.05Z" />
            </svg>
          </button>
          {isThemeOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-48 backdrop-blur-lg rounded-xl shadow-2xl p-2"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              {(['dark', 'light', 'ocean'] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setTheme(name)
                    setIsThemeOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 flex items-center gap-2"
                  style={{
                    color: 'var(--color-text-primary)',
                    background:
                      themeName === name ? 'var(--color-bg-surface-active)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (themeName !== name)
                      e.currentTarget.style.background = 'var(--color-bg-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    if (themeName !== name) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {themeName === name && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {themeName !== name && <span className="w-4" />}
                  {THEMES[name].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        getStatistics={getStatistics}
        getDailyFocusData={getDailyFocusData}
      />
      <p
        className="text-sm font-medium tracking-widest uppercase mb-8"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Pomodoro Timer
      </p>
      <CycleSelector currentCycle={currentCycle} onSwitchCycle={switchCycle} />
      <div className="my-12">
        <TimerDisplay timeRemaining={timeRemaining} isRunning={isRunning} />
      </div>
      <TimerControls isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} />
    </div>
  )
}
