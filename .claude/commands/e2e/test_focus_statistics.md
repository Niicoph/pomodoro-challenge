# E2E Test: Focus Statistics & Session Tracking

Run through the following test steps to validate the focus statistics feature works end-to-end.

## Prerequisites
- Start the dev server: `npm run dev`
- Open http://localhost:5173 in a browser
- Clear localStorage (`localStorage.removeItem('pomodoro-session-history')`) for a clean state

## Test Steps

### 1. Statistics Button Visibility
- Verify a chart/bar-chart icon button is visible in the top-left area of the screen
- Verify it does not overlap or conflict with the notification settings button (top-right)
- Take screenshot

### 2. Statistics Modal Open/Close
- Click the chart icon button
- Verify a modal overlay appears with a semi-transparent dark backdrop
- Verify the modal contains: header "Focus Statistics", period selector tabs, three metric cards, and a bar chart area
- Verify the modal follows the glassmorphism design (backdrop blur, semi-transparent background)
- Take screenshot
- Click the close button (X icon) in the modal header
- Verify the modal closes
- Take screenshot
- Reopen the modal and click the backdrop overlay (outside the modal card)
- Verify the modal closes
- Take screenshot

### 3. Default Period Selection
- Open the statistics modal
- Verify "Today" is the default selected period tab
- Verify the "Today" tab appears visually active/highlighted
- Take screenshot

### 4. Period Selector Switching
- With the modal open, click "Last 7 days" tab
- Verify the tab becomes active and "Today" becomes inactive
- Verify metric values and chart update
- Click "Last 28 days" tab
- Verify the tab becomes active
- Verify the chart displays more bars than the 7-day view
- Click "Today" tab to switch back
- Verify the chart returns to showing today's data
- Take screenshot

### 5. Metric Cards Empty State
- With a fresh state (no session history), open the statistics modal
- Verify Focus Time card shows "0m"
- Verify Sessions card shows "0"
- Verify Break Time card shows "0m"
- Take screenshot

### 6. Bar Chart Empty State
- With a fresh state, verify the bar chart area shows "No focus sessions recorded" message
- Verify the message is displayed in a subtle/muted style
- Take screenshot

### 7. Session Recording on Work Completion
- Close the statistics modal
- Start a Work timer and let it complete (or temporarily reduce duration for testing)
- Open the statistics modal
- Verify Focus Time card shows the recorded work session time (e.g., "25m")
- Verify Sessions card shows "1"
- Verify Break Time card still shows "0m"
- Verify the bar chart now shows a bar for today with the recorded focus time
- Take screenshot

### 8. Session Recording on Break Completion
- Close the statistics modal
- Start a Short Break timer and let it complete
- Open the statistics modal
- Verify Break Time card now shows the recorded break time (e.g., "5m")
- Verify Focus Time and Sessions remain unchanged from the previous work session
- Take screenshot

### 9. Multiple Session Recording
- Complete another Work session
- Open the statistics modal
- Verify Focus Time has increased (e.g., "50m" for two 25-min sessions)
- Verify Sessions card shows "2"
- Take screenshot

### 10. Bar Chart Rendering
- With recorded sessions, verify the chart shows bars with proportional heights
- Hover over a bar to verify tooltip shows the minutes value (e.g., "50 min")
- Verify bars have rounded tops and proper spacing
- Take screenshot

### 11. Chart Labels by Period
- Select "Today" period — verify the label shows "Today"
- Select "Last 7 days" — verify labels show abbreviated day names (Mon, Tue, etc.)
- Select "Last 28 days" — verify labels show day-of-month numbers with only every 7th label displayed
- Take screenshot for each period

### 12. Data Persistence Across Page Reloads
- Complete at least one work session to have data
- Note the current statistics values
- Refresh the page (F5)
- Open the statistics modal
- Verify all session data is preserved and metrics match pre-refresh values
- Take screenshot

### 13. Timer Continues While Modal Is Open
- Start a timer
- Open the statistics modal while the timer is running
- Verify the timer continues counting down in the background
- Close the modal and verify the timer shows the correct remaining time
- Take screenshot

### 14. Existing Timer Functionality Preserved
- Start a Work timer, pause it, resume it, reset it — verify all controls work
- Switch between Work, Short Break, and Long Break — verify cycle switching works
- Verify background gradient changes correctly for each cycle
- Verify notification settings button still works
- Verify notification banners still appear on timer completion
- Take screenshot
