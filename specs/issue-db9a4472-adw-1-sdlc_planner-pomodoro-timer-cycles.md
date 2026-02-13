# Feature: Pomodoro Timer Cycles

## Metadata
issue_number: `db9a4472`
adw_id: `1`
issue_json: `{"number":1,"title":"Timer functionality","body":"Implement the core Pomodoro timer functionality with three distinct cycle types: 25-minute work sessions, 5-minute short breaks, and 15-minute long breaks. This is the foundational feature of the Pomodoro app."}`

## Feature Description
Implement the core Pomodoro timer functionality — the foundational feature of the application. The timer supports three distinct cycle types: **Work Session** (25 minutes), **Short Break** (5 minutes), and **Long Break** (15 minutes). Users can start, pause, and reset the timer, switch between cycle types, and see a large, easy-to-read countdown display. Each cycle type has its own color scheme for instant visual identification, and the UI provides smooth transitions and clear interactive feedback (hover/active states). This feature replaces the current placeholder landing page with a fully functional Pomodoro timer.

## User Story
As a user who wants to improve focus and productivity
I want a Pomodoro timer with work sessions and break cycles
So that I can follow the Pomodoro Technique to manage my time effectively

## Problem Statement
The application currently displays only a static placeholder page with no functionality. Users need a working Pomodoro timer to start, pause, and reset timed work sessions and breaks — the core value proposition of the app.

## Solution Statement
Build a complete timer system with React components and a custom `useTimer` hook. The timer will count down from configurable durations for three cycle types (Work: 25 min, Short Break: 5 min, Long Break: 15 min). The UI will feature a large countdown display, clearly labeled control buttons (Start/Pause, Reset), cycle-type selector tabs, and distinct color schemes per cycle type. All state management will use React hooks, keeping the architecture simple and extensible for future features like notifications, session tracking, and localStorage persistence.

## Relevant Files
Use these files to implement the feature:

- **`src/App.tsx`** — Current root component; will be updated to render the new `PomodoroTimer` component instead of the placeholder content.
- **`src/index.css`** — Global styles; will add custom CSS for timer animations (pulse effect) and smooth transitions.
- **`src/main.tsx`** — Entry point; no changes needed.
- **`tailwind.config.js`** — Tailwind configuration; will extend with custom colors for the three cycle types.
- **`package.json`** — Project dependencies; no new libraries required.
- **`tsconfig.json`** — TypeScript config; no changes needed (strict mode already enabled).

### New Files
- **`src/types/timer.ts`** — TypeScript types and constants for timer cycle types, durations, and state.
- **`src/hooks/useTimer.ts`** — Custom React hook encapsulating all timer logic (countdown, start, pause, reset, cycle switching).
- **`src/components/TimerDisplay.tsx`** — Component rendering the large countdown display (MM:SS format).
- **`src/components/TimerControls.tsx`** — Component rendering Start/Pause and Reset buttons with icons.
- **`src/components/CycleSelector.tsx`** — Component rendering tab buttons to switch between Work, Short Break, and Long Break.
- **`src/components/PomodoroTimer.tsx`** — Main container component composing all timer sub-components.
- **`.claude/commands/e2e/test_pomodoro_timer.md`** — E2E test script for validating the timer feature.

## Implementation Plan
### Phase 1: Foundation
Define the TypeScript types, constants, and the core timer hook. This establishes the data model and business logic before any UI work begins.

- Create `src/types/timer.ts` with cycle type enums, duration constants, and timer state interface.
- Create `src/hooks/useTimer.ts` with the `useTimer` custom hook that manages countdown logic using `setInterval`, exposes start/pause/reset/switch-cycle actions, and tracks the current cycle type and remaining time.

### Phase 2: Core Implementation
Build the UI components that consume the timer hook and render the Pomodoro interface.

- Create `src/components/TimerDisplay.tsx` — large, centered countdown in MM:SS format with a pulsing animation when running.
- Create `src/components/TimerControls.tsx` — Start/Pause toggle button and Reset button with SVG icons, hover/active states.
- Create `src/components/CycleSelector.tsx` — three tab buttons (Work, Short Break, Long Break) with active state highlighting and cycle-specific colors.
- Create `src/components/PomodoroTimer.tsx` — container that uses `useTimer`, passes state/actions to child components, and applies cycle-specific background color scheme.

### Phase 3: Integration
Wire everything together in the app shell, apply global styles, and configure Tailwind colors.

- Update `tailwind.config.js` to add custom colors for work (red/rose), short break (green/emerald), and long break (blue/sky) cycle types.
- Update `src/index.css` to add a CSS `@keyframes pulse-slow` animation for the running timer.
- Update `src/App.tsx` to render `PomodoroTimer` as the main content.
- Create the E2E test command file for validation.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create TypeScript types and constants
- Create `src/types/timer.ts`
- Define a `CycleType` union type: `'work' | 'shortBreak' | 'longBreak'`
- Define a `CYCLE_DURATIONS` constant mapping each cycle type to its duration in seconds: `{ work: 1500, shortBreak: 300, longBreak: 900 }`
- Define a `CYCLE_LABELS` constant mapping each cycle type to its display label: `{ work: 'Work', shortBreak: 'Short Break', longBreak: 'Long Break' }`
- Define a `TimerState` interface with fields: `timeRemaining: number`, `isRunning: boolean`, `currentCycle: CycleType`
- Export all types and constants

### Step 2: Create the useTimer custom hook
- Create `src/hooks/useTimer.ts`
- Implement `useTimer()` hook returning `{ timeRemaining, isRunning, currentCycle, start, pause, reset, switchCycle }`
- Use `useState` for `timeRemaining` (initialized to `CYCLE_DURATIONS.work`), `isRunning` (false), and `currentCycle` ('work')
- Use `useEffect` with `setInterval` (1-second interval) to decrement `timeRemaining` when `isRunning` is true
- When `timeRemaining` reaches 0, stop the timer (`setIsRunning(false)`)
- `start()`: sets `isRunning` to true
- `pause()`: sets `isRunning` to false
- `reset()`: sets `isRunning` to false and `timeRemaining` to the duration of the current cycle
- `switchCycle(cycle: CycleType)`: sets `currentCycle`, resets `timeRemaining` to the new cycle's duration, and stops the timer
- Clean up the interval on unmount via the `useEffect` cleanup function

### Step 3: Create the TimerDisplay component
- Create `src/components/TimerDisplay.tsx`
- Accept props: `timeRemaining: number`, `isRunning: boolean`
- Format `timeRemaining` into `MM:SS` using `Math.floor(time / 60)` and `time % 60`, zero-padded
- Render a large text display (e.g., `text-8xl font-mono font-bold`) centered on screen
- Add a subtle pulsing animation class (`animate-pulse-slow`) when the timer is running
- Use Tailwind classes for styling; text color inherited from parent's cycle-specific scheme

### Step 4: Create the TimerControls component
- Create `src/components/TimerControls.tsx`
- Accept props: `isRunning: boolean`, `onStart: () => void`, `onPause: () => void`, `onReset: () => void`
- Render a Start/Pause toggle button: shows "Start" (play icon) when paused, "Pause" (pause icon) when running
- Render a Reset button with a reset icon
- Use inline SVG icons (simple play triangle, double-bar pause, circular arrow reset)
- Apply Tailwind classes for spacing, rounded corners, hover/active scale transforms, and transition effects
- Buttons should use `bg-white/20 hover:bg-white/30` for a glassmorphism style that works with any cycle color

### Step 5: Create the CycleSelector component
- Create `src/components/CycleSelector.tsx`
- Accept props: `currentCycle: CycleType`, `onSwitchCycle: (cycle: CycleType) => void`
- Render three tab buttons: "Work", "Short Break", "Long Break" using `CYCLE_LABELS`
- Highlight the active tab with `bg-white/30 font-semibold` and inactive tabs with `bg-white/10 hover:bg-white/20`
- Apply rounded pill shape, smooth transitions, and appropriate spacing
- Import `CycleType` and `CYCLE_LABELS` from types

### Step 6: Create the PomodoroTimer container component
- Create `src/components/PomodoroTimer.tsx`
- Use the `useTimer` hook to get all timer state and actions
- Define a color mapping object for cycle-specific background gradients:
  - `work`: `from-rose-500 to-red-600`
  - `shortBreak`: `from-emerald-500 to-green-600`
  - `longBreak`: `from-sky-500 to-blue-600`
- Render a full-screen container with the cycle-specific gradient background and smooth `transition-all duration-700`
- Compose: `CycleSelector` at top, `TimerDisplay` in center, `TimerControls` at bottom
- Add an app title "Pomodoro Timer" at the very top in small, subtle text
- All text should be white for contrast against the colored backgrounds

### Step 7: Create the E2E test command file
- Create `.claude/commands/e2e/test_pomodoro_timer.md`
- Define test steps:
  1. **Initial State**: Open http://localhost:5173, verify timer displays "25:00", Work cycle is active, Start button is visible. Take screenshot.
  2. **Start Timer**: Click Start, verify timer is counting down (display changes from "25:00"), button changes to "Pause". Take screenshot.
  3. **Pause Timer**: Click Pause, verify countdown stops, button changes back to "Start". Take screenshot.
  4. **Reset Timer**: Click Reset, verify timer resets to "25:00" and is paused. Take screenshot.
  5. **Switch to Short Break**: Click "Short Break" tab, verify timer resets to "05:00" and cycle color changes to green. Take screenshot.
  6. **Switch to Long Break**: Click "Long Break" tab, verify timer resets to "15:00" and cycle color changes to blue. Take screenshot.
  7. **Switch back to Work**: Click "Work" tab, verify timer resets to "25:00" and cycle color changes to red. Take screenshot.
  8. **Timer completion**: (optional manual test) Verify that when timer reaches 00:00 it stops automatically.

### Step 8: Update Tailwind configuration
- Edit `tailwind.config.js` to extend the `animation` key with `'pulse-slow': 'pulse-slow 2s ease-in-out infinite'`
- Add the `keyframes` for `pulse-slow`: opacity oscillates between 1 and 0.7

### Step 9: Update global CSS
- Edit `src/index.css` to ensure the body and root allow full-height gradient backgrounds
- Remove conflicting hardcoded `background-color` and `color` from `:root` so Tailwind classes take precedence

### Step 10: Update App.tsx
- Replace the placeholder content in `src/App.tsx` with the `PomodoroTimer` component
- Remove the unused `useState` import
- Import and render `PomodoroTimer` as the sole child

### Step 11: Run validation commands
- Run `npm run build` to verify TypeScript compilation and production build succeed with zero errors
- Run `npm run lint` to verify no linting issues
- Start `npm run dev` and manually test in browser at http://localhost:5173
- Execute the E2E test steps from `.claude/commands/e2e/test_pomodoro_timer.md`

## Testing Strategy
### Unit Tests
- **useTimer hook**: Verify initial state (timeRemaining=1500, isRunning=false, currentCycle='work'). Verify start/pause toggle. Verify reset returns to cycle duration. Verify switchCycle changes cycle and resets time. Verify countdown decrements by 1 each second. Verify timer stops at 0.
- **TimerDisplay**: Verify MM:SS formatting for various values (e.g., 1500→"25:00", 300→"05:00", 65→"01:05", 0→"00:00"). Verify pulse animation class applied when running.
- **CycleSelector**: Verify correct tab is highlighted based on currentCycle prop. Verify clicking a tab calls onSwitchCycle with correct argument.
- **TimerControls**: Verify Start/Pause button label toggles based on isRunning. Verify click handlers are called.

### Edge Cases
- Timer reaching exactly 0 should stop and not go negative
- Rapid start/pause toggling should not create multiple intervals
- Switching cycle while timer is running should stop the timer and reset
- Component unmount should clean up the interval to prevent memory leaks
- Very fast clicks on controls should be handled gracefully

## Acceptance Criteria
- Timer displays "25:00" on initial load with Work cycle active
- Clicking Start begins countdown, display updates every second
- Clicking Pause stops countdown, display freezes at current time
- Clicking Reset stops timer and resets to the current cycle's full duration
- Clicking "Short Break" tab switches to 05:00 with green color scheme
- Clicking "Long Break" tab switches to 15:00 with blue color scheme
- Clicking "Work" tab switches to 25:00 with red/rose color scheme
- Timer automatically stops when reaching 00:00
- All buttons have visible hover and active states
- Background color transitions smoothly when switching cycle types
- UI is responsive and centered on all screen sizes
- `npm run build` completes with zero errors
- `npm run lint` completes with zero warnings

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` - Run build to validate the feature compiles with zero errors
- `npm run lint` - Run ESLint to validate code quality with zero warnings
- `npm run dev` - Start development server and manually test the feature
- Test in browser at http://localhost:5173

## Notes
- No new npm dependencies are required — this feature is built entirely with React, TypeScript, and Tailwind CSS.
- The `useTimer` hook is designed to be extensible: future features (notifications, session tracking, localStorage persistence) can hook into the existing state and actions.
- The color scheme uses Tailwind's built-in palette (rose, emerald, sky) for consistency and dark-mode compatibility later.
- The glassmorphism-style buttons (`bg-white/20`) work universally across all cycle color backgrounds.
- SVG icons are inlined to avoid external dependencies; they can be swapped for an icon library (e.g., Lucide, Heroicons) in a future enhancement.
