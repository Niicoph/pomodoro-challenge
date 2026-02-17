import { CycleType, CYCLE_LABELS } from '../types/timer'

const CYCLE_TYPES: CycleType[] = ['work', 'shortBreak', 'longBreak']

export default function CycleSelector({
  currentCycle,
  onSwitchCycle,
}: {
  currentCycle: CycleType
  onSwitchCycle: (cycle: CycleType) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {CYCLE_TYPES.map((cycle) => (
        <button
          key={cycle}
          onClick={() => onSwitchCycle(cycle)}
          className="rounded-full px-4 py-2 text-sm transition-all duration-200"
          style={{
            background:
              cycle === currentCycle
                ? 'var(--color-bg-surface-active)'
                : 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontWeight: cycle === currentCycle ? 600 : 400,
            boxShadow: cycle === currentCycle ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {CYCLE_LABELS[cycle]}
        </button>
      ))}
    </div>
  )
}
