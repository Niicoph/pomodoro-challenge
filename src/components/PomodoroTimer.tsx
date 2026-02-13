import { useTimer } from '../hooks/useTimer';
import { CycleType } from '../types/timer';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import CycleSelector from './CycleSelector';

const CYCLE_COLORS: Record<CycleType, string> = {
  work: 'from-rose-500 to-red-600',
  shortBreak: 'from-emerald-500 to-green-600',
  longBreak: 'from-sky-500 to-blue-600',
};

export default function PomodoroTimer() {
  const { timeRemaining, isRunning, currentCycle, start, pause, reset, switchCycle } = useTimer();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${CYCLE_COLORS[currentCycle]} transition-all duration-700 flex flex-col items-center justify-center p-4`}
    >
      <p className="text-white/70 text-sm font-medium tracking-widest uppercase mb-8">
        Pomodoro Timer
      </p>
      <CycleSelector currentCycle={currentCycle} onSwitchCycle={switchCycle} />
      <div className="my-12">
        <TimerDisplay timeRemaining={timeRemaining} isRunning={isRunning} />
      </div>
      <TimerControls isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} />
    </div>
  );
}
