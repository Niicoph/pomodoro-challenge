import { useState } from 'react'
import { NotificationSettings as NotificationSettingsType } from '../types/notifications'
import { TimerSettings, TIMER_SETTINGS_BOUNDS } from '../types/timer'

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
      style={{
        background: enabled ? 'var(--color-toggle-on)' : 'var(--color-toggle-off)',
      }}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  const [localValue, setLocalValue] = useState(String(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    const num = parseInt(e.target.value, 10)
    if (!isNaN(num)) {
      onChange(Math.max(TIMER_SETTINGS_BOUNDS.min, Math.min(TIMER_SETTINGS_BOUNDS.max, num)))
    }
  }

  const handleBlur = () => {
    const num = parseInt(localValue, 10)
    if (isNaN(num) || num < TIMER_SETTINGS_BOUNDS.min) {
      setLocalValue(String(TIMER_SETTINGS_BOUNDS.min))
      onChange(TIMER_SETTINGS_BOUNDS.min)
    } else if (num > TIMER_SETTINGS_BOUNDS.max) {
      setLocalValue(String(TIMER_SETTINGS_BOUNDS.max))
      onChange(TIMER_SETTINGS_BOUNDS.max)
    } else {
      setLocalValue(String(num))
    }
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={TIMER_SETTINGS_BOUNDS.min}
          max={TIMER_SETTINGS_BOUNDS.max}
          step={1}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-16 py-1 text-center text-sm rounded-lg"
          style={{
            background: 'var(--color-bg-surface-hover)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          min
        </span>
      </div>
    </div>
  )
}

export default function NotificationSettings({
  settings,
  onUpdateSettings,
  onRequestPermission,
  timerSettings,
  onUpdateTimerSettings,
}: {
  settings: NotificationSettingsType
  onUpdateSettings: (settings: Partial<NotificationSettingsType>) => void
  onRequestPermission: () => Promise<boolean>
  timerSettings: TimerSettings
  onUpdateTimerSettings: (settings: Partial<TimerSettings>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleBrowserToggle = async () => {
    if (!settings.browserEnabled) {
      const granted = await onRequestPermission()
      if (granted) {
        onUpdateSettings({ browserEnabled: true })
      }
    } else {
      onUpdateSettings({ browserEnabled: false })
    }
  }

  const supportsNotifications = 'Notification' in window

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl active:scale-95 transition-all duration-200"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
        }}
        aria-label="Notification settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-72 backdrop-blur-lg rounded-xl shadow-2xl p-4"
          style={{
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
          }}
        >
          <h3 className="text-sm font-semibold mb-3">Notifications</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound notifications</span>
              <Toggle
                enabled={settings.audioEnabled}
                onToggle={() => onUpdateSettings({ audioEnabled: !settings.audioEnabled })}
              />
            </div>

            {supportsNotifications && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Browser notifications</span>
                <Toggle enabled={settings.browserEnabled} onToggle={handleBrowserToggle} />
              </div>
            )}
          </div>

          <div
            className="my-3"
            style={{ borderTop: '1px solid var(--color-border)' }}
          />

          <h3 className="text-sm font-semibold mb-3">Timer Durations</h3>

          <div className="space-y-3">
            <DurationInput
              label="Work"
              value={timerSettings.workMinutes}
              onChange={(v) => onUpdateTimerSettings({ workMinutes: v })}
            />
            <DurationInput
              label="Short Break"
              value={timerSettings.shortBreakMinutes}
              onChange={(v) => onUpdateTimerSettings({ shortBreakMinutes: v })}
            />
            <DurationInput
              label="Long Break"
              value={timerSettings.longBreakMinutes}
              onChange={(v) => onUpdateTimerSettings({ longBreakMinutes: v })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
