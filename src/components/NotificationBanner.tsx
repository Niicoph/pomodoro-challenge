import { CycleType } from '../types/timer'

const CYCLE_BG: Record<CycleType, string> = {
  work: 'bg-rose-600/90',
  shortBreak: 'bg-emerald-600/90',
  longBreak: 'bg-sky-600/90',
}

export default function NotificationBanner({
  message,
  suggestion,
  cycleType,
  isVisible,
  onDismiss,
}: {
  message: string
  suggestion: string
  cycleType: CycleType | null
  isVisible: boolean
  onDismiss: () => void
}) {
  if (!isVisible || !cycleType) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md ${CYCLE_BG[cycleType]} backdrop-blur rounded-xl shadow-2xl px-5 py-4 text-white animate-notification-enter`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{message}</p>
          <p className="text-white/80 text-xs mt-1">{suggestion}</p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
