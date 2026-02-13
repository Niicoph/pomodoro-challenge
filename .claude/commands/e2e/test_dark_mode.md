# E2E Test: Dark Mode Toggle

## Prerequisites
- Start the dev server with `npm run dev`
- Open `http://localhost:5173` in the browser

## Test Steps

### Test 1: Default Theme (System Preference)
- Clear localStorage and reload the page
- Verify the app respects the system's `prefers-color-scheme` setting
- Take a screenshot of the initial state

### Test 2: Theme Toggle Button
- Verify the theme toggle button is visible in the header area
- Verify it shows a moon icon in light mode (indicating "switch to dark")
- Click the toggle button
- Verify the theme switches to dark mode
- Verify the icon changes to a sun icon (indicating "switch to light")
- Take a screenshot in dark mode

### Test 3: Dark Mode Appearance
- Verify the page background changes to a dark color (dark gray/slate)
- Verify the header text is light-colored and readable
- Verify task cards have dark backgrounds with light text
- Verify the input field and select dropdown have dark backgrounds
- Verify the "Add" button is still visible with appropriate contrast
- Verify category badges are readable in dark mode
- Verify filter buttons are readable in dark mode
- Take a screenshot showing task list in dark mode

### Test 4: Switching Back to Light Mode
- Click the toggle button again
- Verify the theme switches back to light mode
- Verify all elements return to their light mode appearance
- Take a screenshot in light mode

### Test 5: Smooth Transitions
- Observe that background and text color changes have a smooth transition (not an abrupt switch)

### Test 6: Persistence
- Switch to dark mode
- Refresh the page
- Verify the app loads in dark mode (preference persisted)
- Switch to light mode
- Refresh the page
- Verify the app loads in light mode (preference persisted)
- Take a screenshot after refresh

### Test 7: Accessibility
- Verify the toggle button has an accessible label (aria-label)
- Verify contrast ratios meet WCAG AA in both themes
- Take a screenshot
