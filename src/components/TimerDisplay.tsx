function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function TimerDisplay({
  timeRemaining,
  isRunning,
}: {
  timeRemaining: number
  isRunning: boolean
}) {
  return (
    <div
      className={`text-8xl sm:text-9xl font-mono font-bold tracking-tight ${
        isRunning ? 'animate-pulse-slow' : ''
      }`}
      style={{ color: 'var(--color-text-primary)' }}
    >
      {formatTime(timeRemaining)}
    </div>
  )
}
