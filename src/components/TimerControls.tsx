export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRunning ? onPause : onStart}
        className="flex items-center gap-2 active:scale-95 transition-all duration-200 rounded-xl px-6 py-3 font-semibold"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
        }}
      >
        {isRunning ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clipRule="evenodd"
              />
            </svg>
            Start
          </>
        )}
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 active:scale-95 transition-all duration-200 rounded-xl px-6 py-3 font-semibold"
        style={{
          background: 'var(--color-bg-surface)',
          color: 'var(--color-text-primary)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903H14.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v4.356l-1.903-1.903A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm14.49 3.882a7.5 7.5 0 0 1-12.548 3.364l-1.903-1.903H9.75a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 1.5 0v-4.356l1.903 1.903A9 9 0 0 0 20.694 14.33a.75.75 0 1 0-1.45-.388Z"
            clipRule="evenodd"
          />
        </svg>
        Reset
      </button>
    </div>
  )
}
