# Feature: Pomodoro Timer Cycles

## Metadata
issue_number: `1`
adw_id: `737838ee`
issue_json: `{"number":1,"title":"Timer functionality","body":"Implement the core Pomodoro timer functionality with three distinct cycle types: 25-minute work sessions, 5-minute short breaks, and 15-minute long breaks. This is the foundational feature of the Pomodoro app.\n\nFunctional Requirements\n\nTimer Cycles\n\n    Work Session: 25 minutes (1500 seconds)\n    Short Break: 5 minutes (300 seconds)\n    Long Break: 15 minutes (900 seconds)\n\nUI/UX Considerations\n\n    Large, easy-to-read timer display\n    Clearly labeled buttons with intuitive icons\n    Different color schemes for work vs break cycles\n    Smooth transitions between states\n    Visual feedback for user interactions (hover, active states)\n"}`

## Feature Description
Implement the core Pomodoro timer functionality — the foundational feature of the application. The timer supports three distinct cycle types: **Work Session** (25 minutes / 1500 seconds), **Short Break** (5 minutes / 300 seconds), and **Long Break** (15 minutes / 900 seconds). Users can start, pause, and reset the timer, switch between cycle types, and see a large, easy-to-read countdown display. Each cycle type has its own color scheme for instant visual identification (red/rose for work, green/emerald for short break, blue/sky for long break). The UI provides smooth transitions between states, clearly labeled buttons with intuitive icons, and visual feedback for all user interactions (hover, active states). This feature replaces the current placeholder landing page with a fully functional Pomodoro timer.

## User Story
As a user who wants to improve focus and productivity
I want a Pomodoro timer with configurable work sessions and break cycles
So that I can follow the Pomodoro Technique to manage my time effectively

## Problem Statement
The application currently displays only a static placeholder page with no functionality. Users need a working Pomodoro timer with start, pause, and reset controls to manage timed work sessions and breaks — the core value proposition of the app.

## Solution Statement
Build a complete timer system using React components and a custom `useTimer` hook. The timer counts down from configurable durations for three cycle types (Work: 25 min, Short Break: 5 min, Long Break: 15 min). The UI features a large MM:SS countdown display, clearly labeled control buttons with SVG icons (Start/Pause, Reset), cycle-type selector tabs, and distinct color schemes per cycle type with smooth gradient transitions. All state management uses React hooks, keeping the architecture simple and extensible for future features like notifications, session tracking, and localStorage persistence.

## Relevant Files
Use these files to implement the feature:

- **`src/App.tsx`** — Current root component displaying placeholder content; will be updated to render the new `PomodoroTimer` component.
- **`src/index.css`** — Global styles with Tailwind directives; will be cleaned up to remove conflicting hardcoded colors so Tailwind classes take full effect.
- **`src/main.tsx`** — Entry point; no changes needed.
- **`tailwind.config.js`** — Tailwind configuration; will extend with custom animation keyframes for the running timer pulse effect.
- **`package.json`** — Project dependencies; no new libraries required.
- **`tsconfig.json`** — TypeScript config; no changes needed (strict mode already enabled).

### New Files
- **`src/types/timer.ts`** — TypeScript types and constants for timer cycle types, durations, labels, and timer state interface.
- **`src/hooks/useTimer.ts`** — Custom React hook encapsulating all timer logic (countdown via `setInterval`, start, pause, reset, cycle switching).
- **`src/components/TimerDisplay.tsx`** — Component rendering the large countdown display in MM:SS format with pulse animation when running.
- **`src/components/TimerControls.tsx`** — Component rendering Start/Pause toggle and Reset buttons with inline SVG icons and hover/active states.
- **`src/components/CycleSelector.tsx`** — Component rendering tab buttons to switch between Work, Short Break, and Long Break cycle types.
- **`src/components/PomodoroTimer.tsx`** — Main container component composing all timer sub-components with cycle-specific gradient backgrounds.
- **`.claude/commands/e2e/test_pomodoro_timer.md`** — E2E test command file for validating the timer feature works end-to-end.

## Implementation Plan
### Phase 1: Foundation
Define the TypeScript types, constants, and the core timer hook. This establishes the data model and business logic before any UI work begins.

- Create `src/types/timer.ts` with cycle type union, duration constants, display labels, and timer state interface.
- Create `src/hooks/useTimer.ts` with the `useTimer` custom hook managing countdown logic using `setInterval`, exposing start/pause/reset/switchCycle actions, and tracking current cycle type and remaining time.

### Phase 2: Core Implementation
Build the UI components that consume the timer hook and render the Pomodoro interface.

- Create `src/components/TimerDisplay.tsx` — large, centered countdown in MM:SS format with a subtle pulsing animation when running.
- Create `src/components/TimerControls.tsx` — Start/Pause toggle button and Reset button with SVG icons, hover/active scale transforms.
- Create `src/components/CycleSelector.tsx` — three tab buttons for cycle selection with active state highlighting and cycle-specific styling.
- Create `src/components/PomodoroTimer.tsx` — container component using `useTimer`, composing child components, and applying cycle-specific gradient background.

### Phase 3: Integration
Wire everything together in the app shell, apply global styles, and configure Tailwind.

- Update `tailwind.config.js` to add custom `pulse-slow` animation keyframes.
- Update `src/index.css` to remove conflicting hardcoded colors so Tailwind classes take precedence.
- Update `src/App.tsx` to render `PomodoroTimer` as the main content.
- Create the E2E test command file for validation.
- Run all validation commands to confirm zero errors.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create the E2E test command file
- Create directory `.claude/commands/e2e/` if it doesn't exist
- Create `.claude/commands/e2e/test_pomodoro_timer.md` with the following test steps:
  1. **Initial State**: Open http://localhost:5173, verify timer displays "25:00", Work cycle tab is active, Start button is visible. Take screenshot.
  2. **Start Timer**: Click Start button, verify timer is counting down (display changes from "25:00"), button label changes to "Pause". Take screenshot.
  3. **Pause Timer**: Click Pause button, verify countdown stops, button label changes back to "Start". Take screenshot.
  4. **Reset Timer**: Click Reset button, verify timer resets to "25:00" and is paused. Take screenshot.
  5. **Switch to Short Break**: Click "Short Break" tab, verify timer displays "05:00" and background color changes to green gradient. Take screenshot.
  6. **Switch to Long Break**: Click "Long Break" tab, verify timer displays "15:00" and background color changes to blue gradient. Take screenshot.
  7. **Switch back to Work**: Click "Work" tab, verify timer displays "25:00" and background color changes to red/rose gradient. Take screenshot.
  8. **Timer completion**: (manual verification) Confirm that when timer reaches 00:00 it stops automatically and does not go negative.

### Step 2: Create TypeScript types and constants
- Create directory `src/types/` if it doesn't exist
- Create `src/types/timer.ts`
- Define `CycleType` as a union type: `'work' | 'shortBreak' | 'longBreak'`
- Define `CYCLE_DURATIONS` constant: `{ work: 1500, shortBreak: 300, longBreak: 900 }` (values in seconds)
- Define `CYCLE_LABELS` constant: `{ work: 'Work', shortBreak: 'Short Break', longBreak: 'Long Break' }`
- Define `TimerState` interface: `{ timeRemaining: number; isRunning: boolean; currentCycle: CycleType }`
- Define `TimerActions` interface: `{ start: () => void; pause: () => void; reset: () => void; switchCycle: (cycle: CycleType) => void }`
- Export all types and constants

### Step 3: Create the useTimer custom hook
- Create directory `src/hooks/` if it doesn't exist
- Create `src/hooks/useTimer.ts`
- Import types and constants from `../types/timer`
- Implement `useTimer()` hook returning `TimerState & TimerActions`
- Use `useState` for `timeRemaining` (initialized to `CYCLE_DURATIONS.work`), `isRunning` (initialized to `false`), and `currentCycle` (initialized to `'work'`)
- Use `useEffect` with `setInterval` (1000ms interval) to decrement `timeRemaining` by 1 when `isRunning` is true
- When `timeRemaining` reaches 0, call `setIsRunning(false)` to stop the timer
- `start()`: sets `isRunning` to `true` (only if `timeRemaining > 0`)
- `pause()`: sets `isRunning` to `false`
- `reset()`: sets `isRunning` to `false` and `timeRemaining` to `CYCLE_DURATIONS[currentCycle]`
- `switchCycle(cycle)`: sets `currentCycle` to the new cycle, resets `timeRemaining` to `CYCLE_DURATIONS[cycle]`, and sets `isRunning` to `false`
- Return cleanup function in `useEffect` to clear the interval on unmount
- Use `useRef` or `useCallback` as needed to ensure stable references and prevent stale closures

### Step 4: Create the TimerDisplay component
- Create directory `src/components/` if it doesn't exist
- Create `src/components/TimerDisplay.tsx`
- Accept props: `timeRemaining: number`, `isRunning: boolean`
- Create a `formatTime` helper: convert seconds to `MM:SS` format using `Math.floor(time / 60)` and `time % 60`, zero-padded with `padStart(2, '0')`
- Render a large text element with classes: `text-8xl sm:text-9xl font-mono font-bold tracking-tight text-white`
- Apply a subtle pulsing animation class (`animate-pulse-slow`) when `isRunning` is true
- Export the component as default

### Step 5: Create the TimerControls component
- Create `src/components/TimerControls.tsx`
- Accept props: `isRunning: boolean`, `onStart: () => void`, `onPause: () => void`, `onReset: () => void`
- Render a Start/Pause toggle button:
  - When paused: show play triangle SVG icon + "Start" label
  - When running: show double-bar pause SVG icon + "Pause" label
  - onClick: call `onStart` or `onPause` based on `isRunning`
- Render a Reset button with circular arrow SVG icon + "Reset" label
- Style buttons with: `bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200 rounded-xl px-6 py-3 text-white font-semibold`
- Add `flex items-center gap-2` for icon + label alignment
- Wrap buttons in a flex container with gap spacing

### Step 6: Create the CycleSelector component
- Create `src/components/CycleSelector.tsx`
- Accept props: `currentCycle: CycleType`, `onSwitchCycle: (cycle: CycleType) => void`
- Import `CycleType` and `CYCLE_LABELS` from types
- Define an array of cycle types: `['work', 'shortBreak', 'longBreak'] as const`
- Map over cycle types to render tab buttons with the corresponding label from `CYCLE_LABELS`
- Active tab styling: `bg-white/30 font-semibold` with a subtle shadow
- Inactive tab styling: `bg-white/10 hover:bg-white/20`
- Common styling: `rounded-full px-4 py-2 text-white text-sm transition-all duration-200`
- onClick: call `onSwitchCycle(cycleType)` for each button

### Step 7: Create the PomodoroTimer container component
- Create `src/components/PomodoroTimer.tsx`
- Import and use the `useTimer` hook
- Import all child components: `TimerDisplay`, `TimerControls`, `CycleSelector`
- Import `CycleType` from types
- Define a `CYCLE_COLORS` mapping for gradient backgrounds:
  - `work`: `'from-rose-500 to-red-600'`
  - `shortBreak`: `'from-emerald-500 to-green-600'`
  - `longBreak`: `'from-sky-500 to-blue-600'`
- Render a full-screen container `div` with:
  - `min-h-screen bg-gradient-to-br ${CYCLE_COLORS[currentCycle]} transition-all duration-700`
  - `flex flex-col items-center justify-center p-4`
- Layout from top to bottom:
  1. App title: "Pomodoro Timer" in `text-white/70 text-sm font-medium tracking-widest uppercase mb-8`
  2. `CycleSelector` component
  3. `TimerDisplay` component (with generous vertical margin)
  4. `TimerControls` component
- Pass appropriate props to each child component

### Step 8: Update Tailwind configuration
- Edit `tailwind.config.js`
- Extend the `theme.extend` object with:
  - `animation`: `{ 'pulse-slow': 'pulse-slow 2s ease-in-out infinite' }`
  - `keyframes`: `{ 'pulse-slow': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } } }`

### Step 9: Update global CSS
- Edit `src/index.css`
- Remove the hardcoded `color` and `background-color` properties from the `:root` selector (keep `font-family`, `line-height`, `font-weight`, `font-synthesis`, `text-rendering`, and font smoothing properties)
- Remove `color-scheme: light dark` as it conflicts with our explicit color management
- Ensure the body element can fill the full viewport for gradient backgrounds

### Step 10: Update App.tsx
- Edit `src/App.tsx`
- Remove the `useState` import (it's unused)
- Import `PomodoroTimer` from `./components/PomodoroTimer`
- Replace the entire return JSX with just `<PomodoroTimer />`
- Remove the unused placeholder content

### Step 11: Run validation commands
- Run `npm run build` to verify TypeScript compilation and Vite production build succeed with zero errors
- Run `npm run lint` to verify ESLint reports zero warnings or errors
- Start `npm run dev` and test in browser at http://localhost:5173
- Walk through the E2E test steps from `.claude/commands/e2e/test_pomodoro_timer.md` to verify all functionality

## Testing Strategy
### Unit Tests
- **useTimer hook**: Verify initial state (`timeRemaining` = 1500, `isRunning` = false, `currentCycle` = 'work'). Verify `start()` sets `isRunning` to true. Verify `pause()` sets `isRunning` to false. Verify `reset()` returns `timeRemaining` to the current cycle's full duration and stops the timer. Verify `switchCycle()` changes cycle, resets time to new cycle's duration, and stops timer. Verify countdown decrements by 1 each second when running. Verify timer stops automatically at 0.
- **TimerDisplay**: Verify MM:SS formatting for various values (1500 → "25:00", 300 → "05:00", 65 → "01:05", 0 → "00:00"). Verify pulse animation class is applied only when `isRunning` is true.
- **CycleSelector**: Verify the correct tab is highlighted based on `currentCycle` prop. Verify clicking a tab calls `onSwitchCycle` with the correct cycle type argument.
- **TimerControls**: Verify Start/Pause button label and icon toggle based on `isRunning`. Verify clicking Start calls `onStart`. Verify clicking Pause calls `onPause`. Verify clicking Reset calls `onReset`.

### Edge Cases
- Timer reaching exactly 0 should stop and not go negative (no -1, -2, etc.)
- Rapid start/pause toggling should not create multiple intervals or cause race conditions
- Switching cycle while timer is running should stop the timer and reset to new cycle's full duration
- Component unmount during active countdown should clean up the interval to prevent memory leaks
- Very fast repeated clicks on controls should be handled gracefully without UI glitches
- Starting when `timeRemaining` is 0 should not start the countdown (nothing to count down from)

## Acceptance Criteria
- Timer displays "25:00" on initial load with the Work cycle tab visually active
- Clicking Start begins the countdown, display updates every second
- Clicking Pause stops the countdown, display freezes at current time
- Clicking Reset stops the timer and resets display to the current cycle's full duration
- Clicking "Short Break" tab switches to "05:00" with green/emerald gradient background
- Clicking "Long Break" tab switches to "15:00" with blue/sky gradient background
- Clicking "Work" tab switches to "25:00" with red/rose gradient background
- Timer automatically stops when reaching "00:00" and does not go negative
- All buttons have visible hover and active states (scale transform, background opacity change)
- Background color gradient transitions smoothly (duration-700) when switching cycle types
- UI is responsive and centered on all screen sizes (mobile through desktop)
- Large, easy-to-read timer display using monospace font (text-8xl on mobile, text-9xl on larger screens)
- `npm run build` completes with zero errors
- `npm run lint` completes with zero warnings

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` - Run TypeScript compilation and Vite production build to validate zero errors
- `npm run lint` - Run ESLint to validate code quality with zero warnings
- `npm run dev` - Start development server and manually test the feature
- Test in browser at http://localhost:5173
- Walk through E2E test steps in `.claude/commands/e2e/test_pomodoro_timer.md`

## Notes
- **No new npm dependencies required** — this feature is built entirely with React 18, TypeScript, and Tailwind CSS which are already configured in the project.
- **Extensible architecture**: The `useTimer` hook is designed for extensibility. Future features (notifications in Issue #3, session tracking in Issue #4, localStorage persistence, customizable durations in Issue #5) can hook into the existing state and actions without refactoring.
- **Color palette**: Uses Tailwind's built-in color palette (rose, emerald, sky) for consistency and easy dark-mode adaptation later (Issue #6).
- **Glassmorphism buttons**: The `bg-white/20` translucent button style works universally across all cycle color backgrounds without needing cycle-specific button colors.
- **Inline SVG icons**: Icons are inlined to avoid external dependencies; they can be swapped for an icon library (e.g., Lucide, Heroicons) in future if needed.
- **Strict TypeScript**: The project has `strict: true`, `noUnusedLocals: true`, and `noUnusedParameters: true` enabled — all code must satisfy these constraints.
