# Feature: Add Focus Statistics & Session Tracking

## Metadata
issue_number: `5`
adw_id: `af87dd64`
issue_json: ``

## Feature Description
Implement a statistics dashboard section that allows users to visualize their focus activity over time. The feature tracks Pomodoro sessions (completed work sessions, break sessions), total focus time, total break time, and number of focus sessions, then presents them in a clear, elegant UI. Users can select a time period (Today, Last 7 days, Last 28 days) to view aggregated metrics and a bar chart showing daily focus time distribution. All session data is persisted in localStorage so it survives page refreshes. The dashboard is accessible via a chart/statistics icon button and renders as a modal overlay on top of the existing timer UI, matching the current glassmorphism design language.

## User Story
As a Pomodoro timer user
I want to see statistics about my focus sessions over time
So that I can track my productivity trends, reinforce consistency, and stay motivated to continue using the app

## Problem Statement
Currently, the Pomodoro timer app has no way for users to see their historical productivity data. Each session is ephemeral — once completed, there is no record of how much focus time was accumulated, how many sessions were completed, or how break time was distributed. Users lack visibility into their productivity patterns, making it difficult to build habits or measure progress over time.

## Solution Statement
Add a session tracking system that automatically records every completed Pomodoro session (work, short break, long break) with timestamps and durations into localStorage. Build a statistics dashboard component that reads this data, aggregates it by the selected time period (Today / Last 7 days / Last 28 days), and displays:

1. **Summary metric cards** — Total focus time, number of focus sessions, and total break time displayed as prominent cards.
2. **Period selector** — Tab-style buttons to switch between Today, Last 7 days, and Last 28 days.
3. **Bar chart** — A daily focus time chart rendered using pure CSS (no charting library needed) showing focus minutes per day for the selected range.

The statistics view is a modal/overlay triggered by a chart icon button positioned in the top-left area of the screen. The session recording integrates with the existing `useTimer` completion flow via the `onComplete` callback already in place.

## Relevant Files
Use these files to implement the feature:

- **`src/types/timer.ts`** — Contains `CycleType` union and `CYCLE_DURATIONS` constants. Needed to determine session types and default durations for recording.
- **`src/hooks/useTimer.ts`** — The core timer hook with `onComplete` callback. The statistics feature hooks into this callback to record completed sessions.
- **`src/components/PomodoroTimer.tsx`** — The main container component. Will be updated to integrate session recording and render the statistics button/modal.
- **`src/index.css`** — Global styles. May need minor additions for chart styling.
- **`tailwind.config.js`** — May need additional animation keyframes for modal enter/exit transitions.
- **`package.json`** — No new dependencies required. Charts will be built with pure CSS.

### New Files
- **`src/types/statistics.ts`** — TypeScript types for session records, statistics state, and period options.
- **`src/hooks/useSessionHistory.ts`** — Custom hook to record sessions to localStorage and retrieve/aggregate session data by time period.
- **`src/components/StatisticsModal.tsx`** — The main statistics dashboard modal component containing the period selector, metric cards, and bar chart.
- **`src/components/StatisticsChart.tsx`** — The bar chart component that renders daily focus time using pure CSS divs.
- **`.claude/commands/e2e/test_focus_statistics.md`** — E2E test specification for validating the statistics feature.

## Implementation Plan
### Phase 1: Foundation
Define TypeScript types for session records and statistics. Create the `useSessionHistory` hook that records completed sessions to localStorage and provides aggregation functions to compute metrics (total focus time, session count, total break time) and daily focus data for any given time range. This hook is the data backbone of the entire feature.

### Phase 2: Core Implementation
Build the UI components:
- `StatisticsChart` — a pure CSS bar chart component that takes daily data points and renders vertical bars with labels.
- `StatisticsModal` — the main dashboard overlay with period selector tabs (Today / Last 7 days / Last 28 days), three metric summary cards, and the bar chart. Styled with glassmorphism (`bg-white/20 backdrop-blur`) to match existing UI patterns.

### Phase 3: Integration
Wire the session recording into the existing `PomodoroTimer` component by leveraging the `onComplete` callback from `useTimer`. Add a chart icon button to the UI that opens the statistics modal. Ensure the modal overlays correctly over the timer without breaking existing functionality.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `.claude/commands/e2e/test_focus_statistics.md` with detailed test steps for validating all statistics features.
- Test steps should cover: statistics button visibility, modal open/close, period selector switching, metric card values, bar chart rendering, session recording on timer completion, data persistence across page reloads, and no regressions on existing timer functionality.

### Step 2: Define statistics types
- Create `src/types/statistics.ts` with the following types:
  - `SessionRecord`: `{ id: string; cycleType: CycleType; durationSeconds: number; completedAt: string }` — represents a single completed session. `completedAt` is an ISO 8601 date string. `durationSeconds` is the session duration in seconds.
  - `TimePeriod`: `'today' | 'last7days' | 'last28days'` — the available time range options.
  - `PERIOD_LABELS`: `Record<TimePeriod, string>` mapping to `"Today"`, `"Last 7 days"`, `"Last 28 days"`.
  - `DailyFocusData`: `{ date: string; focusMinutes: number }` — aggregated focus time for a single day, where `date` is `YYYY-MM-DD` format.
  - `StatisticsSummary`: `{ totalFocusMinutes: number; focusSessions: number; totalBreakMinutes: number }` — computed metrics for the selected period.

### Step 3: Create the useSessionHistory hook
- Create `src/hooks/useSessionHistory.ts`.
- The hook should:
  - Load session records from localStorage on mount (key: `pomodoro-session-history`). Handle corrupted/missing data gracefully by defaulting to an empty array.
  - Expose `recordSession(cycleType: CycleType, durationSeconds: number): void` to add a new session record with a generated unique ID (`crypto.randomUUID()` with fallback `Date.now().toString(36) + Math.random().toString(36).slice(2)`) and current ISO timestamp. Appends to the sessions array and persists to localStorage.
  - Expose `getStatistics(period: TimePeriod): StatisticsSummary` that filters sessions by the selected period and computes:
    - `totalFocusMinutes`: sum of `durationSeconds` for `work` sessions, converted to minutes (divide by 60, round to 1 decimal).
    - `focusSessions`: count of `work` sessions in the period.
    - `totalBreakMinutes`: sum of `durationSeconds` for `shortBreak` and `longBreak` sessions, converted to minutes.
  - Expose `getDailyFocusData(period: TimePeriod): DailyFocusData[]` that returns an array of daily focus minutes for each day in the period range (including days with zero focus). Use local dates consistently for day grouping. For "today" return 1 entry, for "last7days" return 7 entries, for "last28days" return 28 entries.
  - Expose `sessions` array for reactivity.
  - Persist session records to localStorage whenever a new session is recorded.
  - Use `useCallback` for exposed functions to avoid unnecessary re-renders.

### Step 4: Create the StatisticsChart component
- Create `src/components/StatisticsChart.tsx`.
- Props: `data: DailyFocusData[]`, `period: TimePeriod`.
- Render a bar chart using pure HTML/CSS (div-based bars with Tailwind classes):
  - Container has a fixed height (e.g., `h-40`).
  - Each bar is a div with dynamic height proportional to `focusMinutes` relative to the maximum value in the dataset. The tallest bar fills 100% of the container height.
  - Bars use `bg-white/50 hover:bg-white/70 rounded-t transition-all` for styling.
  - X-axis labels below bars:
    - For "today": show the day name (e.g., "Today").
    - For "last7days": show abbreviated day names (e.g., "Mon", "Tue", ...).
    - For "last28days": show day-of-month numbers, only display every 7th label to avoid crowding.
  - Each bar has a `title` attribute showing "X min" for hover tooltip.
  - If all values are zero, show a centered empty state message: "No focus sessions recorded" in `text-white/50`.
  - Bars should have a minimum width and gap between them for readability.

### Step 5: Create the StatisticsModal component
- Create `src/components/StatisticsModal.tsx`.
- Props: `isOpen: boolean`, `onClose: () => void`, `getStatistics: (period: TimePeriod) => StatisticsSummary`, `getDailyFocusData: (period: TimePeriod) => DailyFocusData[]`.
- Internal state: `selectedPeriod: TimePeriod` (default: `'today'`).
- Layout (matching the design reference):
  - **Overlay backdrop**: semi-transparent dark overlay (`bg-black/50 fixed inset-0 z-50`) that closes the modal on click.
  - **Modal container**: centered card with glassmorphism styling (`bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl`), max-width ~480px, `p-6`.
  - **Header**: "Focus Statistics" title (`text-lg font-semibold text-white`) with a close button (X icon, `p-1 rounded-lg hover:bg-white/20`).
  - **Period selector**: three tab-style buttons ("Today", "Last 7 days", "Last 28 days") styled identically to the existing `CycleSelector` pattern (`rounded-full px-4 py-2 text-white text-sm`, active: `bg-white/30 font-semibold shadow-lg`, inactive: `bg-white/10 hover:bg-white/20`).
  - **Metric cards**: three summary cards in a row (`grid grid-cols-3 gap-3`), each with `bg-white/10 rounded-xl p-4 text-center`:
    - Value displayed large and bold (`text-2xl font-bold text-white`).
    - Label displayed small below (`text-xs text-white/70 mt-1`).
    - Card 1: Focus Time — value is `formatMinutesToDisplay(totalFocusMinutes)`, label "Focus Time".
    - Card 2: Sessions — value is `focusSessions` count, label "Sessions".
    - Card 3: Break Time — value is `formatMinutesToDisplay(totalBreakMinutes)`, label "Break Time".
  - **Bar chart section**: renders `<StatisticsChart>` with the daily focus data and period.
  - **Time format helper** `formatMinutesToDisplay(minutes: number): string` — inline or imported. Returns `"Xh Ym"` format. Examples: `0` → `"0m"`, `25` → `"25m"`, `85` → `"1h 25m"`, `120` → `"2h 0m"`.
- When `isOpen` is false, render nothing.
- Add smooth enter animation: apply `animate-modal-enter` class to the modal container.

### Step 6: Add Tailwind animation keyframes for modal
- In `tailwind.config.js`, extend the `animation` and `keyframes` objects:
  - `modal-enter`: `{ '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } }`, 200ms ease-out.
  - `modal-backdrop-enter`: `{ '0%': { opacity: '0' }, '100%': { opacity: '1' } }`, 150ms ease-out.

### Step 7: Integrate session recording and statistics into PomodoroTimer
- Update `src/components/PomodoroTimer.tsx`:
  - Import `useSessionHistory` and `StatisticsModal`.
  - Import `CYCLE_DURATIONS` from `../types/timer`.
  - Call `useSessionHistory()` to get `recordSession`, `getStatistics`, `getDailyFocusData`.
  - Create a wrapper `handleTimerComplete` callback that:
    1. Calls `triggerNotification(cycleType)` (existing notification behavior).
    2. Calls `recordSession(cycleType, CYCLE_DURATIONS[cycleType])` to record the completed session.
  - Pass `handleTimerComplete` as the `onComplete` callback to `useTimer` (replacing `triggerNotification`).
  - Add state: `const [isStatsOpen, setIsStatsOpen] = useState(false)`.
  - Render a chart icon button in the top-left area (fixed position, `fixed top-4 left-4 z-40`), styled identically to the notification settings button (`p-2.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200 text-white`). Use a bar-chart SVG icon.
  - Render `<StatisticsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} getStatistics={getStatistics} getDailyFocusData={getDailyFocusData} />`.

### Step 8: Run validation commands
- Run `npm run build` to verify TypeScript compilation and build with zero errors.
- Run `npm run dev` to start the development server.
- Manually test in browser at http://localhost:5173:
  - Verify the chart icon button appears in the top-left of the screen.
  - Click the chart icon to open the statistics modal.
  - Verify the modal displays with correct layout: header, period selector, metric cards (all showing 0), bar chart (empty state).
  - Verify switching periods updates the chart (different number of bars/labels).
  - Complete a Pomodoro work session (or temporarily reduce `CYCLE_DURATIONS.work` to 3 seconds for testing).
  - Verify the session is recorded and metrics update (focus time increases, session count goes to 1).
  - Complete a short break session. Verify break time metric updates.
  - Refresh the page and verify session data persists in the statistics view.
  - Verify the modal close button (X) and backdrop click both close the modal.
  - Verify all existing timer functionality still works (start, pause, reset, cycle switching, notifications).
  - Revert any temporary duration changes.

## Testing Strategy
### Unit Tests
- **`useSessionHistory` hook**: Verify session recording adds to localStorage, `getStatistics` correctly aggregates work vs break sessions, `getDailyFocusData` returns correct daily breakdown including zero-value days, loading from corrupted localStorage returns empty state.
- **`StatisticsChart` component**: Verify correct number of bars rendered for each period, bar heights normalized correctly, empty state displayed when all values are zero, correct day labels for each period type.
- **`StatisticsModal` component**: Verify period selector toggles update internal state, metric cards display formatted values, close button calls `onClose`, backdrop click calls `onClose`.
- **Time formatting**: Verify `formatMinutesToDisplay` handles 0 minutes, partial hours, full hours, and large values.

### Edge Cases
- No session history at all (fresh user) — all metrics should show 0, chart should show "No focus sessions recorded" message.
- Sessions exist only for some days in the range — missing days should show 0-height bars in the chart.
- Very large focus times (e.g., 10+ hours) — `formatMinutesToDisplay` should handle correctly (e.g., "10h 30m").
- localStorage is full or unavailable — recording should fail gracefully without crashing the app.
- Corrupted session data in localStorage — should fall back to empty array without errors.
- Session recorded exactly at midnight boundary — should be attributed to the correct calendar day using local time.
- User switches time period rapidly — statistics should update instantly via `useMemo`.
- Modal open/close during active timer — timer should continue running normally in the background.
- Multiple quick session completions — each session should be individually recorded.
- "Today" period at different times of day — should always use midnight-to-midnight of the current local date.

## Acceptance Criteria
1. A chart/statistics icon button is visible in the top-left area of the screen that opens the statistics modal.
2. The statistics modal displays three period selector tabs: "Today", "Last 7 days", "Last 28 days".
3. "Today" is the default selected period.
4. Switching periods immediately updates all displayed metrics and the chart.
5. The modal displays three metric cards: Total Focus Time, Focus Sessions, and Total Break Time with correct aggregated values.
6. Focus time and break time are formatted as "Xh Ym" or "Xm" (e.g., "1h 25m", "0m").
7. A bar chart shows daily focus time for the selected period with one bar per day.
8. The chart displays appropriate day labels for each period (day abbreviations for 7-day, day numbers for 28-day).
9. Empty state is handled gracefully — zero values shown with a friendly message when no data exists.
10. Completing a work session records it and updates statistics immediately.
11. Completing a break session records it and updates break time statistics immediately.
12. Session data persists in localStorage across page refreshes.
13. The modal can be closed via the close button (X) or by clicking the backdrop overlay.
14. The modal UI follows the existing glassmorphism design pattern (`bg-white/20 backdrop-blur`).
15. The feature compiles with zero TypeScript errors (`npm run build` succeeds).
16. All existing timer functionality (start, pause, reset, cycle switching, notifications) is unaffected.
17. The statistics button does not obstruct or conflict with the notification settings button.

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` - Run build to validate the feature compiles with zero errors
- `npm run lint` - Run linting to validate code quality and style compliance
- `npm run format:check` - Run Prettier format check to ensure consistent code formatting
- `npm run dev` - Start development server and manually test the feature
- Test in browser at http://localhost:5173
- Manually verify in browser:
  - Chart icon button visible in top-left and clickable
  - Statistics modal opens with correct layout (header, period selector, metric cards, bar chart)
  - Period selector switches between Today / Last 7 days / Last 28 days
  - Metric cards show correct values (0m / 0 / 0m initially for a fresh state)
  - Complete a work session — verify focus time and session count increment
  - Complete a break session — verify break time metric increments
  - Bar chart renders bars with correct proportional heights
  - Switch periods — verify chart updates with correct number of bars and labels
  - Refresh page — verify all session data persists
  - Close modal via X button and via backdrop click
  - All existing timer features still work (start, pause, reset, cycle switch, notifications)

## Notes
- **No new npm dependencies required.** The bar chart is built using pure HTML/CSS with Tailwind utility classes (div-based bars with percentage heights). This keeps the bundle size small and avoids unnecessary charting library overhead for a simple vertical bar chart.
- **localStorage structure**: Session records are stored as a JSON array under the key `pomodoro-session-history`. Each record includes `id` (unique string), `cycleType` (CycleType), `durationSeconds` (number), and `completedAt` (ISO 8601 string). Consider implementing a cleanup mechanism to prune records older than 90 days to prevent localStorage from growing indefinitely.
- **Design reference**: The UI design shows a dark modal overlay with a card-style container, three metric boxes at the top, period selector tabs, and a bar chart below. The implementation matches this layout using the existing glassmorphism pattern (semi-transparent whites with backdrop blur) already established in the notification settings panel.
- **Time formatting**: Focus time and break time are displayed in human-readable format like "1h 25m" rather than raw minutes. For values under 1 hour, show just "Xm" (e.g., "25m"). For zero, show "0m".
- **Recording trigger**: Sessions are recorded when the timer naturally reaches 00:00 (via the `onComplete` callback). Manually resetting the timer does NOT count as a completed session. The duration recorded is the full cycle duration from `CYCLE_DURATIONS`, not elapsed time.
- **`crypto.randomUUID()` fallback**: If `crypto.randomUUID()` is not available in older browsers, use `Date.now().toString(36) + Math.random().toString(36).slice(2)` as a fallback for generating unique session IDs.
- **Future extensibility**: The `SessionRecord` type and `useSessionHistory` hook are designed to be easily extended with additional fields (e.g., `taskName`, `interrupted`, `notes`) and additional metrics (e.g., average session length, streak tracking, session export) in future iterations.
