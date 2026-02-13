# E2E Test: Audio and Visual Notifications

Run through the following test steps to validate the notification system works end-to-end.

## Prerequisites
- Start the dev server: `npm run dev`
- Open http://localhost:5173 in a browser

## Test Steps

### 1. Settings Panel Visibility
- Verify a gear icon button is visible in the top-right area of the screen
- Click the gear icon
- Verify a settings panel opens with two toggles: "Sound notifications" and "Browser notifications"
- Take screenshot
- Click the gear icon again
- Verify the settings panel closes
- Take screenshot

### 2. Audio Toggle Default State
- Open the settings panel
- Verify "Sound notifications" toggle is ON by default
- Verify "Browser notifications" toggle is OFF by default
- Take screenshot

### 3. Visual Banner on Timer Completion
- Switch to Work cycle and start the timer
- Wait for the timer to reach 00:00 (or temporarily reduce duration for testing)
- Verify a notification banner appears at the top of the screen
- Verify the banner displays "Work session complete! Time for a break."
- Verify the banner includes a suggestion for the next cycle
- Verify the banner has a dismiss button (X icon)
- Take screenshot

### 4. Dismiss Button
- With the notification banner visible, click the dismiss button (X)
- Verify the banner disappears immediately
- Take screenshot

### 5. Auto-Dismiss
- Trigger another timer completion to show the banner
- Wait approximately 5 seconds without clicking dismiss
- Verify the banner disappears automatically
- Take screenshot

### 6. Short Break Completion Banner
- Switch to Short Break cycle and start the timer
- Wait for completion
- Verify the banner displays "Short break complete! Back to work."
- Take screenshot

### 7. Long Break Completion Banner
- Switch to Long Break cycle and start the timer
- Wait for completion
- Verify the banner displays "Long break complete! Ready for a new session."
- Take screenshot

### 8. Audio Notification
- Ensure "Sound notifications" is enabled in settings
- Start a Work timer and let it complete
- Verify a chime sound plays when the timer reaches 00:00
- Toggle "Sound notifications" OFF
- Start another timer and let it complete
- Verify no sound plays
- Take screenshot of settings panel showing toggle OFF

### 9. Browser Notification Permission
- Open the settings panel
- Toggle "Browser notifications" ON
- Verify the browser's notification permission dialog appears
- If permission is granted, verify the toggle stays ON
- If permission is denied, verify the toggle reverts to OFF
- Take screenshot

### 10. Browser Notification When Tab Unfocused
- Enable "Browser notifications" (ensure permission is granted)
- Start a timer
- Switch to a different browser tab
- Wait for the timer to complete
- Verify a system notification appears with the completion message
- Take screenshot

### 11. Settings Persistence
- Toggle "Sound notifications" OFF and "Browser notifications" ON (if permitted)
- Refresh the page
- Open the settings panel
- Verify the toggle states are preserved from before the refresh
- Take screenshot

### 12. Banner Does Not Block Timer
- Trigger a timer completion to show the notification banner
- Verify the timer display (00:00) is still visible and not obscured
- Verify the cycle selector buttons are still accessible
- Verify the Start/Reset buttons are still accessible
- Take screenshot

### 13. Existing Timer Functionality Preserved
- Start a Work timer, pause it, resume it, reset it — verify all controls work
- Switch between Work, Short Break, and Long Break — verify cycle switching works
- Verify background gradient changes correctly for each cycle
- Take screenshot
