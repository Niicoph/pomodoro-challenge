import { useState } from 'react'
import { TimePeriod, PERIOD_LABELS, StatisticsSummary, DailyFocusData } from '../types/statistics'
import StatisticsChart from './StatisticsChart'

function formatMinutesToDisplay(minutes: number): string {
  const totalMinutes = Math.round(minutes)
  if (totalMinutes < 60) return `${totalMinutes}m`
  const hours = Math.floor(totalMinutes / 60)
  const remaining = totalMinutes % 60
  return `${hours}h ${remaining}m`
}

const PERIODS: TimePeriod[] = ['today', 'last7days', 'last28days']

export default function StatisticsModal({
  isOpen,
  onClose,
  getStatistics,
  getDailyFocusData,
}: {
  isOpen: boolean
  onClose: () => void
  getStatistics: (period: TimePeriod) => StatisticsSummary
  getDailyFocusData: (period: TimePeriod) => DailyFocusData[]
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today')

  if (!isOpen) return null

  const stats = getStatistics(selectedPeriod)
  const dailyData = getDailyFocusData(selectedPeriod)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop-enter"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-[480px] backdrop-blur-lg rounded-2xl shadow-2xl p-6 animate-modal-enter"
        style={{ background: 'var(--color-bg-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Focus Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Close statistics"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-5">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className="rounded-full px-4 py-2 text-sm transition-all duration-200"
              style={{
                background:
                  selectedPeriod === period
                    ? 'var(--color-bg-surface-active)'
                    : 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                fontWeight: selectedPeriod === period ? 600 : 400,
                boxShadow: selectedPeriod === period ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {PERIOD_LABELS[period]}
            </button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {formatMinutesToDisplay(stats.totalFocusMinutes)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Focus Time
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {stats.focusSessions}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Sessions
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--color-bg-secondary)' }}
          >
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {formatMinutesToDisplay(stats.totalBreakMinutes)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Break Time
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <StatisticsChart data={dailyData} period={selectedPeriod} />
      </div>
    </div>
  )
}
