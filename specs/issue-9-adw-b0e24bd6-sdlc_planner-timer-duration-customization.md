# Feature: Timer Duration Customization

## Metadata
issue_number: `9`
adw_id: `b0e24bd6`
issue_json: ``

## Feature Description
Implement a settings feature that allows users to customize the duration of Pomodoro timer sessions. Currently, the work (25 min), short break (5 min), and long break (15 min) durations are hardcoded constants in `src/types/timer.ts`. This feature will make those durations configurable through a UI panel, persist the user's preferences in localStorage, validate inputs within sensible bounds (1–120 minutes), and ensure the timer logic reads from the user's configuration rather than hardcoded values. Changes apply to the next started session — a running timer is not affected mid-countdown.

## User Story
As a Pomodoro timer user
I want to customize the duration of my work sessions, short breaks, and long breaks
So that I can adapt the timer to my personal productivity rhythm and preferences

## Problem Statement
The Pomodoro timer currently enforces fixed durations (25/5/15 minutes) with no ability for users to adjust them. Different users have different focus capacities and break needs — some prefer shorter 15-minute work sprints, others want 50-minute deep work sessions. The hardcoded `CYCLE_DURATIONS` constant in `src/types/timer.ts` is used directly by `useTimer` and `PomodoroTimer`, making customization impossible without code changes.

## Solution Statement
Introduce a `TimerSettings` type and a `useTimerSettings` hook that manages user-configured durations with localStorage persistence. Replace all references to the hardcoded `CYCLE_DURATIONS` with the dynamic values from the settings hook. Add a settings UI section within the existing `NotificationSettings` panel (which already serves as the app's settings gear icon) that provides number inputs for work, short break, and long break durations with validation (1–120 minutes). The `useTimer` hook will accept custom durations as a parameter so it reads from configuration rather than constants. The default durations remain 25/5/15 when no custom values are stored.

## Relevant Files
Use these files to implement the feature:

- **`src/types/timer.ts`** — Contains the hardcoded `CYCLE_DURATIONS` constant and `CycleType` type. Will add `TimerSettings` type and `DEFAULT_TIMER_SETTINGS` constant. `CYCLE_DURATIONS` will be kept as default fallback values.
- **`src/hooks/useTimer.ts`** — Timer countdown logic. Currently imports `CYCLE_DURATIONS` directly. Must be updated to accept custom durations as a parameter and use them for `reset` and `switchCycle`.
- **`src/components/PomodoroTimer.tsx`** — Main orchestrator component. Uses `CYCLE_DURATIONS` when recording sessions. Will integrate `useTimerSettings` and pass custom durations to `useTimer`. Will pass settings down to the settings panel.
- **`src/components/NotificationSettings.tsx`** — Existing settings panel with gear icon. Will be expanded to include timer duration configuration inputs below the notification toggles.
- **`src/hooks/useNotifications.ts`** — Existing pattern for localStorage-backed settings hook. Will serve as the reference pattern for the new `useTimerSettings` hook.
- **`src/index.css`** — May need minor styling additions for number input fields.
- **`package.json`** — No new dependencies needed.

### New Files
- **`src/hooks/useTimerSettings.ts`** — New custom hook that manages timer duration settings with localStorage persistence and validation. Follows the same pattern as `useNotifications` for loading/saving settings.
- **`.claude/commands/e2e/test_timer_duration_customization.md`** — E2E test specification for validating the timer duration customization feature.

## Implementation Plan
### Phase 1: Foundation
Define the `TimerSettings` type in `src/types/timer.ts` representing the three configurable durations (in minutes). Create `DEFAULT_TIMER_SETTINGS` with the standard 25/5/15 values. Create the `useTimerSettings` hook that loads/saves settings from localStorage with validation (1–120 minutes), following the same error-handling pattern as `useNotifications`. Create the E2E test specification.

### Phase 2: Core Implementation
Update `useTimer` to accept an optional `customDurations` parameter (a `Record<CycleType, number>` in seconds) that overrides `CYCLE_DURATIONS` for initialization, reset, and cycle switching. Update `PomodoroTimer` to use `useTimerSettings`, convert the minute-based settings to seconds, and pass them into `useTimer`. Expand the `NotificationSettings` component to include duration configuration inputs with the timer settings data and callbacks.

### Phase 3: Integration
Ensure all parts work together: changing durations in the settings UI persists to localStorage, the timer display shows the new duration after reset or cycle switch, session recording uses the actual configured duration, and existing features (notifications, statistics, themes) continue working without regression.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `.claude/commands/e2e/test_timer_duration_customization.md` with detailed test steps:
  - Default durations display correctly (25:00 work, 05:00 short break, 15:00 long break)
  - Settings gear icon opens a panel that includes timer duration inputs
  - Duration inputs show current values (25, 5, 15 by default)
  - Changing work duration to 30 minutes and resetting timer shows 30:00
  - Changing short break duration to 10 minutes, switching to short break shows 10:00
  - Changing long break duration to 20 minutes, switching to long break shows 20:00
  - Validation: entering 0 or negative values is rejected, minimum is 1
  - Validation: entering values above 120 is rejected, maximum is 120
  - Settings persist across page refresh (change to 30/10/20, refresh, verify values)
  - Timer functionality works with custom durations (start, pause, reset, complete)
  - Session recording captures the correct custom duration
  - Existing notification and theme features are unaffected

### Step 2: Define TimerSettings type and defaults
- Update `src/types/timer.ts`:
  - Add `TimerSettings` interface:
    ```typescript
    export interface TimerSettings {
      workMinutes: number
      shortBreakMinutes: number
      longBreakMinutes: number
    }
    ```
  - Add `DEFAULT_TIMER_SETTINGS` constant:
    ```typescript
    export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
    }
    ```
  - Add `TIMER_SETTINGS_BOUNDS` constant:
    ```typescript
    export const TIMER_SETTINGS_BOUNDS = {
      min: 1,
      max: 120,
    }
    ```
  - Add a helper function to convert `TimerSettings` to durations in seconds:
    ```typescript
    export function settingsToDurations(settings: TimerSettings): Record<CycleType, number> {
      return {
        work: settings.workMinutes * 60,
        shortBreak: settings.shortBreakMinutes * 60,
        longBreak: settings.longBreakMinutes * 60,
      }
    }
    ```
  - Keep `CYCLE_DURATIONS` as-is for backward compatibility (it represents the defaults).

### Step 3: Create useTimerSettings hook
- Create `src/hooks/useTimerSettings.ts`:
  - localStorage key: `'pomodoro-timer-settings'`
  - `loadSettings()` function:
    - Read from localStorage, parse JSON
    - Validate each field is a number within `TIMER_SETTINGS_BOUNDS` (1–120)
    - Fall back to `DEFAULT_TIMER_SETTINGS` if any field is invalid or localStorage is unavailable
  - `saveSettings()` function: JSON.stringify and store, with try/catch
  - `clampDuration(value: number): number` helper that clamps to bounds
  - Hook returns:
    - `timerSettings: TimerSettings` — current settings
    - `updateTimerSettings: (partial: Partial<TimerSettings>) => void` — merge partial updates, validate, and save
  - Use `useState` initialized from `loadSettings`
  - Use `useEffect` to persist to localStorage on settings change (same pattern as `useNotifications`)
  - Follow the exact same error-handling and localStorage patterns as `useNotifications` hook

### Step 4: Update useTimer to accept custom durations
- Update `src/hooks/useTimer.ts`:
  - Change the function signature to accept an optional `durations` parameter:
    ```typescript
    export function useTimer(
      onComplete?: (cycleType: CycleType) => void,
      durations?: Record<CycleType, number>
    ): TimerState & TimerActions
    ```
  - Create a local resolved durations variable: `const resolvedDurations = durations ?? CYCLE_DURATIONS`
  - Replace all references to `CYCLE_DURATIONS` with `resolvedDurations`:
    - Initial state: `useState(resolvedDurations.work)`
    - `reset` callback: `setTimeRemaining(resolvedDurations[currentCycle])`
    - `switchCycle` callback: `setTimeRemaining(resolvedDurations[cycle])`
  - Add `resolvedDurations` to dependency arrays of `reset` and `switchCycle` callbacks so they pick up changes
  - IMPORTANT: Do NOT auto-reset a running timer when durations change. The new durations take effect on the next `reset` or `switchCycle` call. This matches the requirement "Changes must apply to the next started session."

### Step 5: Update PomodoroTimer to integrate timer settings
- Update `src/components/PomodoroTimer.tsx`:
  - Import `useTimerSettings` from hooks
  - Import `settingsToDurations` from types
  - Call `useTimerSettings()` to get `timerSettings` and `updateTimerSettings`
  - Compute durations: `const customDurations = settingsToDurations(timerSettings)`
  - Pass `customDurations` to `useTimer`: `useTimer(handleTimerComplete, customDurations)`
  - Update `handleTimerComplete` to use `customDurations` instead of `CYCLE_DURATIONS` for session recording:
    ```typescript
    recordSession(cycleType, customDurations[cycleType])
    ```
  - Pass `timerSettings` and `updateTimerSettings` to `NotificationSettings` (or a renamed settings component)

### Step 6: Expand NotificationSettings to include timer duration controls
- Update `src/components/NotificationSettings.tsx`:
  - Add new props for timer settings:
    ```typescript
    timerSettings: TimerSettings
    onUpdateTimerSettings: (settings: Partial<TimerSettings>) => void
    ```
  - Add a "Timer Durations" section below the existing "Notifications" section, separated by a subtle divider (using `var(--color-border)`)
  - For each duration (Work, Short Break, Long Break), render:
    - A label (e.g., "Work duration")
    - A number input styled to match the app's glassmorphism theme
    - A "min" suffix label
  - Number input styling:
    - Use inline styles with CSS variables for consistent theming
    - `background: var(--color-bg-surface-hover)`, `color: var(--color-text-primary)`, `border: 1px solid var(--color-border)`
    - `rounded-lg`, `text-center`, `w-16`, `py-1`
  - Input behavior:
    - `type="number"`, `min={1}`, `max={120}`, `step={1}`
    - On change, parse the value and call `onUpdateTimerSettings` with the clamped value
    - On blur, ensure the value is clamped to bounds (in case user typed something out of range)
  - The settings panel dropdown width may need to increase slightly (from `w-64` to `w-72`) to accommodate the new controls

### Step 7: Run validation commands
- Run `npm run build` to verify TypeScript compilation and build with zero errors
- Run `npm run dev` to start the development server
- Manually test in browser at http://localhost:5173:
  - Verify default timer shows 25:00 for work cycle
  - Open settings panel — verify timer duration inputs appear with values 25, 5, 15
  - Change work duration to 30 — click reset — verify timer shows 30:00
  - Switch to short break — verify it shows 05:00 (default)
  - Change short break to 10 — switch away and back — verify it shows 10:00
  - Change long break to 20 — switch to long break — verify it shows 20:00
  - Try entering 0 — verify it clamps to 1
  - Try entering 150 — verify it clamps to 120
  - Refresh the page — verify all custom durations persist (30/10/20)
  - Start a timer, verify it counts down correctly with the custom duration
  - Complete a session — verify notification fires correctly
  - Verify statistics still record sessions correctly
  - Verify theme switching still works
  - Verify all existing features are unaffected

## Testing Strategy
### Unit Tests
- **TimerSettings type**: Verify `DEFAULT_TIMER_SETTINGS` has sensible values (25, 5, 15). Verify `settingsToDurations` converts correctly (25 min → 1500 sec, etc.).
- **useTimerSettings hook**: Verify it returns default settings when localStorage is empty. Verify it persists changes to localStorage. Verify it validates and clamps values to 1–120 range. Verify it handles corrupted localStorage gracefully.
- **useTimer with custom durations**: Verify timer initializes with custom work duration. Verify `reset` uses custom duration. Verify `switchCycle` uses custom duration for the target cycle. Verify timer still counts down correctly. Verify `onComplete` still fires at 0.
- **NotificationSettings with timer inputs**: Verify duration inputs render with correct values. Verify changing an input calls the update callback. Verify inputs enforce min/max constraints.

### Edge Cases
- Fresh user with no localStorage entry — should use defaults (25/5/15)
- Corrupted or invalid JSON in localStorage — should fall back to defaults
- localStorage unavailable — should work in-memory with defaults
- Setting duration to minimum (1 minute = 60 seconds) — timer should show 01:00 and count down correctly
- Setting duration to maximum (120 minutes = 7200 seconds) — timer should show 120:00 and count down correctly
- Changing duration while timer is running — should NOT affect the current countdown; takes effect on next reset/switch
- Changing duration while timer is paused (but not at full time) — should NOT change timeRemaining until explicit reset
- Non-integer input — should round or reject
- Empty input field — should revert to previous valid value or default
- Very rapid setting changes — should debounce localStorage writes or handle gracefully
- Browser refresh mid-countdown — timer resets to configured (not default) duration

## Acceptance Criteria
1. Settings panel (gear icon) includes controls for Work, Short Break, and Long Break durations in minutes.
2. Each duration input accepts values from 1 to 120 minutes and rejects invalid values (zero, negative, above 120).
3. Default values are 25 minutes (work), 5 minutes (short break), and 15 minutes (long break).
4. Changing a duration and resetting the timer (or switching cycles) reflects the new duration in the timer display.
5. Changes do NOT affect a currently running timer — they apply on the next start/reset/cycle switch.
6. Duration settings persist in localStorage under the key `'pomodoro-timer-settings'` and survive page refresh.
7. Session recording captures the actual configured duration (not the hardcoded default).
8. The timer display correctly shows the custom duration in MM:SS format (e.g., 45:00 for 45 minutes).
9. All existing features (notifications, statistics, themes, timer controls) continue to work without regression.
10. The feature compiles with zero TypeScript errors (`npm run build` succeeds).
11. The UI for duration inputs matches the existing app styling (glassmorphism, CSS variable-driven colors).
12. No new npm dependencies are required.

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` - Run build to validate the feature compiles with zero errors
- `npm run dev` - Start development server and manually test the feature
- Test in browser at http://localhost:5173
- Manually verify in browser:
  - Default timer displays 25:00 for work, 05:00 for short break, 15:00 for long break
  - Settings gear icon panel shows "Timer Durations" section with 3 number inputs
  - Inputs display default values (25, 5, 15)
  - Changing work duration to 45 and resetting timer shows 45:00
  - Changing short break to 10 and switching cycles shows 10:00
  - Changing long break to 20 and switching cycles shows 20:00
  - Input validation: values clamped to 1–120 range
  - Page refresh preserves custom durations
  - Timer starts, pauses, resets correctly with custom durations
  - Notifications fire on timer completion
  - Session statistics record correct custom durations
  - Theme switching works without issues
  - All existing functionality remains intact

## Notes
- **No new npm dependencies required.** The feature uses React state, hooks, and localStorage — same patterns already established in the codebase.
- **Settings UI placement**: Rather than creating a separate settings modal, the duration controls are added to the existing `NotificationSettings` panel (gear icon). This keeps the UI clean and consistent. The component could be renamed to `SettingsPanel` in a future refactor, but for this feature we keep the existing component name to minimize changes.
- **Minute-based inputs, second-based internals**: Users configure durations in minutes (more intuitive), while the timer internally works in seconds. The `settingsToDurations` helper handles the conversion.
- **No auto-reset on settings change**: Per the requirement "Changes must apply to the next started session," modifying a duration does not immediately reset a running or paused timer. The user must explicitly reset or switch cycles for new durations to take effect.
- **CYCLE_DURATIONS retained**: The original `CYCLE_DURATIONS` constant is kept as the default fallback. This ensures backward compatibility and provides a clear reference for the standard Pomodoro intervals.
- **Future considerations**: Could add preset buttons (e.g., "Classic 25/5/15", "Long Focus 50/10/30") for quick configuration. Could also add auto-start next session toggle. These are out of scope for this issue.
