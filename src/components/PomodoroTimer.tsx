import { useState, useCallback } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useNotifications } from '../hooks/useNotifications'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { CycleType, CYCLE_DURATIONS } from '../types/timer'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import CycleSelector from './CycleSelector'
import NotificationBanner from './NotificationBanner'
import NotificationSettings from './NotificationSettings'
import StatisticsModal from './StatisticsModal'

const CYCLE_COLORS: Record<CycleType, string> = {
  work: 'from-rose-500 to-red-600',
  shortBreak: 'from-emerald-500 to-green-600',
  longBreak: 'from-sky-500 to-blue-600',
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

  const handleTimerComplete = useCallback(
    (cycleType: CycleType) => {
      triggerNotification(cycleType)
      recordSession(cycleType, CYCLE_DURATIONS[cycleType])
    },
    [triggerNotification, recordSession]
  )

  const { timeRemaining, isRunning, currentCycle, start, pause, reset, switchCycle } =
    useTimer(handleTimerComplete)

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${CYCLE_COLORS[currentCycle]} transition-all duration-700 flex flex-col items-center justify-center p-4`}
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
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsStatsOpen(true)}
          className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200 text-white"
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
      </div>
      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        getStatistics={getStatistics}
        getDailyFocusData={getDailyFocusData}
      />
      <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-8">
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
