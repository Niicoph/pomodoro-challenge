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
          className={`rounded-full px-4 py-2 text-white text-sm transition-all duration-200 ${
            cycle === currentCycle
              ? 'bg-white/30 font-semibold shadow-lg'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {CYCLE_LABELS[cycle]}
        </button>
      ))}
    </div>
  )
}
