import { CycleType } from '../types/timer'

const CYCLE_NOTIFICATION_VAR: Record<CycleType, string> = {
  work: 'var(--color-notification-work)',
  shortBreak: 'var(--color-notification-short-break)',
  longBreak: 'var(--color-notification-long-break)',
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md backdrop-blur rounded-xl shadow-2xl px-5 py-4 animate-notification-enter"
      style={{
        background: CYCLE_NOTIFICATION_VAR[cycleType],
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{message}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {suggestion}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
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
