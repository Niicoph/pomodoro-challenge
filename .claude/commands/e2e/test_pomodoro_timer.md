# E2E Test: Pomodoro Timer Cycles

Run through the following test steps to validate the Pomodoro Timer feature works end-to-end.

## Prerequisites
- Start the dev server: `npm run dev`
- Open http://localhost:5173 in a browser

## Test Steps

### 1. Initial State
- Open http://localhost:5173
- Verify timer displays "25:00"
- Verify Work cycle tab is active (highlighted)
- Verify Start button is visible
- Take screenshot

### 2. Start Timer
- Click Start button
- Verify timer is counting down (display changes from "25:00")
- Verify button label changes to "Pause"
- Take screenshot

### 3. Pause Timer
- Click Pause button
- Verify countdown stops
- Verify button label changes back to "Start"
- Take screenshot

### 4. Reset Timer
- Click Reset button
- Verify timer resets to "25:00" and is paused
- Take screenshot

### 5. Switch to Short Break
- Click "Short Break" tab
- Verify timer displays "05:00"
- Verify background color changes to green gradient
- Take screenshot

### 6. Switch to Long Break
- Click "Long Break" tab
- Verify timer displays "15:00"
- Verify background color changes to blue gradient
- Take screenshot

### 7. Switch back to Work
- Click "Work" tab
- Verify timer displays "25:00"
- Verify background color changes to red/rose gradient
- Take screenshot

### 8. Timer completion
- (Manual verification) Confirm that when timer reaches 00:00 it stops automatically and does not go negative
