# E2E Test: Timer Duration Customization

## Test Overview
Validate the timer duration customization feature including settings UI, input validation, localStorage persistence, and integration with timer logic.

## Prerequisites
- Application running at http://localhost:5173
- Browser DevTools available for localStorage inspection

## Test Steps

### 1. Default Durations Display Correctly
- Open http://localhost:5173
- Verify the timer shows 25:00 for the work cycle
- Switch to Short Break — verify it shows 05:00
- Switch to Long Break — verify it shows 15:00
- Switch back to Work — verify it shows 25:00
- Take screenshot: `default-durations.png`

### 2. Settings Panel Includes Timer Duration Inputs
- Click the settings gear icon (top-right)
- Verify the dropdown panel opens
- Verify a "Timer Durations" section appears below the notification toggles
- Verify there are three labeled number inputs: Work, Short Break, Long Break
- Verify each input has a "min" suffix label
- Take screenshot: `timer-duration-settings.png`

### 3. Duration Inputs Show Default Values
- With the settings panel open, verify:
  - Work input shows 25
  - Short Break input shows 5
  - Long Break input shows 15

### 4. Change Work Duration
- Change the Work duration input to 30
- Close the settings panel
- Click Reset on the timer
- Verify the timer display shows 30:00
- Take screenshot: `custom-work-duration.png`

### 5. Change Short Break Duration
- Change the Short Break duration input to 10
- Switch to the Short Break cycle
- Verify the timer display shows 10:00
- Take screenshot: `custom-short-break-duration.png`

### 6. Change Long Break Duration
- Change the Long Break duration input to 20
- Switch to the Long Break cycle
- Verify the timer display shows 20:00
- Take screenshot: `custom-long-break-duration.png`

### 7. Validation — Minimum Value
- Open settings panel
- Try entering 0 in the Work duration input
- Verify the value is clamped to 1 (on blur or immediately)
- Try entering a negative number
- Verify the value is clamped to 1
- Reset the timer and verify it shows 01:00

### 8. Validation — Maximum Value
- Open settings panel
- Try entering 150 in the Work duration input
- Verify the value is clamped to 120 (on blur or immediately)
- Reset the timer and verify it shows 120:00

### 9. Settings Persist Across Page Refresh
- Set durations to 30 (work), 10 (short break), 20 (long break)
- Refresh the page (F5 / Ctrl+R)
- Verify the timer shows 30:00 for work
- Open settings panel — verify inputs show 30, 10, 20
- Switch to Short Break — verify it shows 10:00
- Switch to Long Break — verify it shows 20:00
- Verify localStorage key `pomodoro-timer-settings` contains the custom values

### 10. Timer Functionality With Custom Durations
- Set work duration to 30 minutes
- Reset the timer — verify it shows 30:00
- Start the timer — verify it counts down from 30:00
- Pause the timer — verify it stops counting
- Resume the timer — verify it continues from where it paused
- Reset the timer — verify it returns to 30:00

### 11. Running Timer Not Affected by Settings Change
- Start the timer (work cycle)
- While the timer is running, open settings and change work duration to 45
- Verify the running timer is NOT affected — it continues counting down from its current value
- Pause and reset the timer
- Verify it now shows 45:00 (new duration takes effect on reset)

### 12. Session Recording With Custom Duration
- Set work duration to 30 minutes
- Start the timer and let it complete (or use DevTools to fast-forward)
- Open statistics modal
- Verify the completed session recorded the correct custom duration (30 minutes)

### 13. Existing Features Unaffected
- Verify notification settings toggles still work (sound, browser)
- Complete a timer cycle — verify notification banner appears
- Verify theme switching works correctly
- Verify statistics modal displays correctly
- Verify all cycle types (Work, Short Break, Long Break) are selectable

## Expected Results
- Settings panel includes timer duration controls with proper styling
- Default values are 25/5/15 minutes
- Inputs accept values from 1 to 120 and reject invalid values
- Custom durations reflect in timer display after reset or cycle switch
- Running timers are not affected by mid-countdown settings changes
- Settings persist in localStorage across page refreshes
- Session recording captures the actual configured duration
- All existing features continue to work without regression
- UI matches the existing glassmorphism styling with CSS variables
