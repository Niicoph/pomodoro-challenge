# Feature: Audio and Visual Notifications When Timer Completes

## Metadata
issue_number: `3`
adw_id: `7c425707`
issue_json: ``

## Feature Description
Implement a comprehensive notification system that alerts users when a Pomodoro work session or break timer completes. The system includes three notification channels: audio alerts (sound playback), visual on-screen banners with dismiss/auto-dismiss behavior, and browser push notifications for background tabs. Additionally, a settings panel allows users to toggle audio and browser notifications on/off, with preferences persisted in localStorage. This feature ensures users never miss the end of a cycle and can smoothly transition between work and break sessions.

## User Story
As a Pomodoro timer user
I want to receive audio, visual, and browser notifications when my timer completes
So that I am always aware when a work session or break ends, even if the browser tab is not focused, and can seamlessly transition to the next cycle

## Problem Statement
Currently, when the Pomodoro timer reaches 00:00, it simply stops with no feedback to the user. If the user is not actively watching the timer display, they will miss the completion entirely. This defeats the purpose of timed work sessions, as users cannot rely on the timer to alert them when it's time to switch between work and break periods.

## Solution Statement
Add a multi-channel notification system that fires when the timer reaches zero:
1. **Audio notifications** — play a short notification sound using the Web Audio API (no external dependencies).
2. **Visual notifications** — show an animated on-screen banner/toast that describes the completed cycle and suggests the next action, with a dismiss button and auto-dismiss after 5 seconds.
3. **Browser notifications** — use the Notification API to send a system-level notification when the tab is not focused.
4. **Settings panel** — provide toggles for audio and browser notifications, stored in localStorage for persistence across sessions.

The notification logic will be encapsulated in a custom hook (`useNotifications`) that integrates with the existing `useTimer` hook. The visual notification will be a standalone React component. The settings panel will be a collapsible overlay accessible via a gear icon.

## Relevant Files
Use these files to implement the feature:

- **`src/types/timer.ts`** — Add notification-related types (`NotificationSettings`, extended `CycleType` completion messages). Contains the `CycleType` union and `CYCLE_LABELS` constants needed for notification messages.
- **`src/hooks/useTimer.ts`** — The core timer hook. Must detect when the timer reaches 0 and trigger a callback/event so the notification system can react.
- **`src/components/PomodoroTimer.tsx`** — The main container component. Will orchestrate the notification hook, render the notification banner, and host the settings button.
- **`src/components/TimerDisplay.tsx`** — May need minor updates if we add a visual flash effect at 00:00.
- **`tailwind.config.js`** — Add keyframe animations for notification banner fade-in/fade-out and optional flash effect.
- **`index.html`** — No changes needed.
- **`package.json`** — No new dependencies required. We will use the Web Audio API and Notification API (both browser-native).

### New Files
- **`src/types/notifications.ts`** — TypeScript types for notification settings and notification state.
- **`src/hooks/useNotifications.ts`** — Custom hook that handles audio playback, browser notifications, and notification state management.
- **`src/components/NotificationBanner.tsx`** — On-screen visual alert component with dismiss and auto-dismiss behavior.
- **`src/components/NotificationSettings.tsx`** — Settings panel component with toggles for audio and browser notifications.
- **`src/utils/audio.ts`** — Utility to generate notification sounds using the Web Audio API (no audio files needed).
- **`.claude/commands/e2e/test_notifications.md`** — E2E test command for validating notification functionality.

## Implementation Plan
### Phase 1: Foundation
Set up the type definitions, utility functions, and the notification hook that will be the backbone of the feature:
- Define TypeScript types for notification settings and state.
- Create a Web Audio API utility to synthesize short notification sounds (different tones for work vs. break completion).
- Build the `useNotifications` hook that manages settings persistence (localStorage), audio playback, browser notification permissions, and visual notification state.

### Phase 2: Core Implementation
Build the UI components and integrate them with the notification hook:
- Create the `NotificationBanner` component with animated fade-in/out, cycle-specific messages, and a dismiss button.
- Create the `NotificationSettings` component with toggle switches for audio and browser notifications.
- Add Tailwind animation keyframes for banner enter/exit transitions.

### Phase 3: Integration
Wire everything together in the existing timer system:
- Modify `useTimer` to expose an `onComplete` callback or a `justCompleted` flag that the notification system can consume.
- Update `PomodoroTimer.tsx` to use `useNotifications`, render the banner and settings components, and trigger notifications when the timer completes.
- Ensure the notification system correctly identifies which cycle just completed and displays appropriate messages.

## Step by Step Tasks

### Step 1: Create E2E test specification
- Create `.claude/commands/e2e/test_notifications.md` with detailed test steps for validating all notification features.
- Test steps should cover: visual banner appearance on timer completion, dismiss button, auto-dismiss, settings toggle UI, audio toggle behavior, and browser notification permission request.

### Step 2: Define notification types
- Create `src/types/notifications.ts` with the following types:
  - `NotificationSettings`: `{ audioEnabled: boolean; browserEnabled: boolean }`
  - `NotificationState`: `{ isVisible: boolean; message: string; cycleType: CycleType | null }`
  - `COMPLETION_MESSAGES`: Record mapping each `CycleType` to a completion message string (e.g., `work` → `"Work session complete! Time for a break."`)
  - `NEXT_CYCLE_SUGGESTIONS`: Record mapping each `CycleType` to a suggestion string (e.g., `work` → `"Start your short break"`)

### Step 3: Create audio utility
- Create `src/utils/audio.ts` with a function `playNotificationSound(cycleType: CycleType): void`.
- Use the Web Audio API (`AudioContext`) to synthesize a short chime:
  - Work completion: two ascending tones (e.g., C5 → E5), indicating "done, relax".
  - Short break completion: two tones (e.g., E5 → G5), indicating "back to work".
  - Long break completion: three ascending tones (e.g., C5 → E5 → G5), indicating "refreshed, start again".
- Each tone should be ~150ms with a short gap between tones.
- Handle `AudioContext` initialization gracefully (browsers require user interaction before audio can play — the start button click satisfies this).

### Step 4: Create the useNotifications hook
- Create `src/hooks/useNotifications.ts`.
- The hook should:
  - Load `NotificationSettings` from localStorage on mount (default: `{ audioEnabled: true, browserEnabled: false }`).
  - Expose `settings` and `updateSettings(partial: Partial<NotificationSettings>)` for the settings UI.
  - Expose `notificationState: NotificationState` for the visual banner.
  - Expose `triggerNotification(cycleType: CycleType): void` that:
    1. Sets `notificationState` to visible with the appropriate message.
    2. Plays the audio sound if `audioEnabled` is true.
    3. Sends a browser notification if `browserEnabled` is true and the tab is not focused (`!document.hasFocus()`).
    4. Sets a 5-second auto-dismiss timer.
  - Expose `dismissNotification(): void` to manually hide the banner.
  - Expose `requestBrowserPermission(): Promise<boolean>` to request notification permission when the user enables browser notifications.
  - Persist settings to localStorage whenever they change.

### Step 5: Modify useTimer to support completion callback
- In `src/hooks/useTimer.ts`, add an `onComplete` callback parameter to the hook:
  - Change the signature to `useTimer(onComplete?: (cycleType: CycleType) => void)`.
  - In the `useEffect` that manages the countdown, when `prev <= 1` (timer reaches 0), call `onComplete?.(currentCycle)` in addition to stopping the timer.
  - Use a `useRef` for the callback to avoid stale closures and unnecessary re-renders.

### Step 6: Create the NotificationBanner component
- Create `src/components/NotificationBanner.tsx`.
- Props: `message: string`, `cycleType: CycleType`, `isVisible: boolean`, `onDismiss: () => void`.
- Render a fixed-position banner at the top of the screen (or overlaid on top of the timer).
- Style with Tailwind: rounded corners, semi-transparent background matching the cycle color, white text, shadow.
- Include a dismiss button (X icon) on the right side.
- Use Tailwind transition classes for smooth fade-in (opacity-0 → opacity-100, translate-y) when `isVisible` is true.
- When `isVisible` is false, render nothing (or use opacity-0 + pointer-events-none for animation).
- Show the completion message and the next cycle suggestion.
- Add `role="alert"` and `aria-live="polite"` for screen reader accessibility.

### Step 7: Create the NotificationSettings component
- Create `src/components/NotificationSettings.tsx`.
- Props: `settings: NotificationSettings`, `onUpdateSettings: (settings: Partial<NotificationSettings>) => void`, `onRequestPermission: () => Promise<boolean>`.
- Render a gear icon button that opens/closes a dropdown panel.
- Inside the panel, show two toggle rows:
  - "Sound notifications" with an on/off toggle (styled as a Tailwind switch).
  - "Browser notifications" with an on/off toggle. When enabling, call `onRequestPermission()` first; if denied, keep the toggle off and show a brief message.
- Style with glassmorphism (`bg-white/20 backdrop-blur`) to match existing UI.
- Position the settings button in the top-right corner of the screen (fixed or absolute within the PomodoroTimer container).

### Step 8: Add Tailwind animation keyframes
- In `tailwind.config.js`, extend the `animation` and `keyframes` objects:
  - `notification-enter`: slide down + fade in (translateY from -100% to 0, opacity 0 to 1, 300ms ease-out).
  - `notification-exit`: slide up + fade out (translateY from 0 to -100%, opacity 1 to 0, 300ms ease-in).

### Step 9: Integrate everything in PomodoroTimer
- Update `src/components/PomodoroTimer.tsx`:
  - Import and call `useNotifications()`.
  - Pass `triggerNotification` as the `onComplete` callback to `useTimer`.
  - Render `<NotificationBanner>` with state from `useNotifications`.
  - Render `<NotificationSettings>` with settings and handlers from `useNotifications`.
  - Ensure the settings button and notification banner are positioned correctly and don't block the timer display.

### Step 10: Run validation commands
- Run `npm run build` to verify TypeScript compilation and build with zero errors.
- Run `npm run dev` to start the development server.
- Manually test in browser at http://localhost:5173:
  - Start a timer (use short durations for testing by temporarily modifying `CYCLE_DURATIONS`).
  - Verify visual banner appears on completion.
  - Verify audio plays on completion.
  - Verify dismiss button works.
  - Verify auto-dismiss after 5 seconds.
  - Verify settings toggles work and persist on page reload.
  - Verify browser notification appears when tab is not focused.
  - Revert any temporary duration changes.

## Testing Strategy
### Unit Tests
- **`useNotifications` hook**: Verify settings load from localStorage, `triggerNotification` sets correct state, `dismissNotification` clears state, settings persistence on update, auto-dismiss timer fires after 5 seconds.
- **`playNotificationSound`**: Verify the function does not throw and creates an AudioContext (mock the Web Audio API).
- **`NotificationBanner` component**: Verify it renders the correct message for each cycle type, shows/hides based on `isVisible`, calls `onDismiss` on button click.
- **`NotificationSettings` component**: Verify toggles reflect current settings, toggling calls `onUpdateSettings`, enabling browser notifications calls `onRequestPermission`.

### Edge Cases
- Timer reaches 0 while audio is already playing (should not stack or crash).
- User denies browser notification permission — toggle should revert to off, no errors thrown.
- User rapidly toggles settings — localStorage should remain consistent.
- Browser does not support Notification API (older browsers) — degrade gracefully, hide browser notification toggle.
- AudioContext is suspended (not yet activated by user interaction) — handle the `resume()` promise.
- Multiple timer completions in quick succession (user resets and completes rapidly) — banner should update message, not stack multiple banners.
- Settings are corrupted in localStorage — fall back to defaults.
- Tab is focused when browser notification fires — should not show browser notification (only visual banner).

## Acceptance Criteria
1. When any timer (work, short break, long break) reaches 00:00, a visual notification banner appears at the top of the screen.
2. The banner displays a message specific to the completed cycle (e.g., "Work session complete! Time for a break.").
3. The banner includes a dismiss button that removes it immediately when clicked.
4. The banner auto-dismisses after 5 seconds if not manually dismissed.
5. The banner has smooth fade-in and fade-out animations.
6. When audio notifications are enabled, a chime sound plays when the timer completes.
7. Different cycle types produce distinct notification sounds.
8. When browser notifications are enabled and the tab is not focused, a system notification is sent.
9. The browser notification displays the cycle type and a suggested next action.
10. A settings panel is accessible via a gear icon in the UI.
11. The settings panel contains toggles for audio notifications and browser notifications.
12. Enabling browser notifications triggers a permission request if not already granted.
13. All notification settings persist in localStorage across page reloads.
14. The notification banner is accessible (screen reader compatible with `role="alert"`).
15. The notification UI does not block or obstruct the timer display.
16. The feature compiles with zero TypeScript errors (`npm run build` succeeds).
17. The feature works on mobile devices (responsive layout, audio plays on mobile browsers).

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` — Run build to validate the feature compiles with zero TypeScript errors and zero build errors.
- `npm run lint` — Run linting to validate code quality and style compliance.
- `npm run format:check` — Run Prettier format check to ensure consistent code formatting.
- `npm run dev` — Start development server and manually test the feature in browser at http://localhost:5173.
- Manually verify in browser:
  - Timer completion triggers visual banner with correct message.
  - Dismiss button works immediately.
  - Auto-dismiss works after ~5 seconds.
  - Audio plays on timer completion (when enabled).
  - Settings gear icon opens/closes settings panel.
  - Audio toggle enables/disables sound.
  - Browser notification toggle requests permission and sends notification when tab is unfocused.
  - Settings persist after page reload.
  - All existing timer functionality (start, pause, reset, cycle switching) still works correctly.

## Notes
- **No new npm dependencies required.** The Web Audio API and Notification API are native browser APIs. Notification sounds are synthesized programmatically, eliminating the need for audio files.
- **Web Audio API approach**: Synthesizing sounds avoids the need to bundle audio files, keeps the project lightweight, and allows different tones per cycle type. The `AudioContext` requires user interaction before it can play — clicking the Start button satisfies this browser requirement.
- **Browser notification permission**: The permission request is triggered only when the user explicitly enables the browser notification toggle, not on page load. This respects user agency and avoids the common anti-pattern of requesting permissions on first visit.
- **Future extensibility**: The `NotificationSettings` type and `useNotifications` hook are designed to be easily extended with additional settings (e.g., volume control, custom sounds) in future iterations.
- **Mobile considerations**: The Web Audio API works on modern mobile browsers. Browser notifications may have limited support on iOS Safari — the feature degrades gracefully by hiding the toggle when the Notification API is not available.
