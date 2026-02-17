import { DailyFocusData, TimePeriod } from '../types/statistics'

function getDayLabel(dateStr: string, index: number, period: TimePeriod): string | null {
  const date = new Date(dateStr + 'T00:00:00')

  switch (period) {
    case 'today':
      return 'Today'
    case 'last7days': {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return days[date.getDay()]
    }
    case 'last28days': {
      if (index % 7 === 0 || index === 27) {
        return String(date.getDate())
      }
      return null
    }
  }
}

export default function StatisticsChart({
  data,
  period,
}: {
  data: DailyFocusData[]
  period: TimePeriod
}) {
  const maxMinutes = Math.max(...data.map((d) => d.focusMinutes), 0)
  const allZero = maxMinutes === 0

  if (allZero) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          No focus sessions recorded
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="h-40 flex items-end gap-[2px]">
        {data.map((d) => {
          const heightPercent = maxMinutes > 0 ? (d.focusMinutes / maxMinutes) * 100 : 0
          return (
            <div key={d.date} className="flex-1 flex flex-col justify-end h-full min-w-[4px]">
              <div
                className="rounded-t transition-all duration-200 w-full"
                style={{
                  height: `${heightPercent}%`,
                  minHeight: d.focusMinutes > 0 ? '2px' : '0',
                  background: 'var(--color-chart-bar)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-chart-bar-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-chart-bar)'
                }}
                title={`${Math.round(d.focusMinutes)} min`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-[2px] mt-1">
        {data.map((d, index) => {
          const label = getDayLabel(d.date, index, period)
          return (
            <div key={d.date} className="flex-1 min-w-[4px] text-center">
              {label && (
                <span
                  className="text-[9px] leading-none"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {label}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
