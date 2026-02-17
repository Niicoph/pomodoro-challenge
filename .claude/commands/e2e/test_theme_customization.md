# E2E Test: Theme Customization

## Test Overview
Validate the theme customization feature including theme selector UI, theme switching, CSS variable application, and localStorage persistence.

## Prerequisites
- Application running at http://localhost:5173
- Browser DevTools available for CSS inspection

## Test Steps

### 1. Default Theme Loads Correctly
- Open http://localhost:5173
- Verify the app loads with the "Default Dark" theme
- Verify gradient backgrounds are rose/red for work cycle
- Verify text is white
- Verify surfaces (buttons, dropdowns) use semi-transparent white glass effect
- Take screenshot: `default-dark-theme.png`

### 2. Theme Selector Button Visibility
- Verify a palette icon button is visible in the top bar area
- Verify it does not overlap with the statistics button or notification settings button
- Verify the button has appropriate hover and active states

### 3. Theme Selector Dropdown
- Click the palette icon button
- Verify a dropdown appears with at least 3 theme options: "Default Dark", "Light", "Ocean Breeze"
- Verify the currently active theme ("Default Dark") has a visual indicator (checkmark or highlight)
- Click the palette button again to close the dropdown
- Verify the dropdown closes correctly

### 4. Switch to Light Theme
- Click the palette icon button to open the dropdown
- Select "Light" theme
- Verify all backgrounds change to light colors (light gray/white)
- Verify text becomes dark (slate/gray tones)
- Verify surfaces use light, semi-transparent backgrounds
- Verify accent colors for work cycle use warm red/rose tones
- Take screenshot: `light-theme.png`

### 5. Light Theme Global Application
- Verify the timer display text is dark-colored
- Verify timer controls (Start/Pause, Reset buttons) have light theme styling
- Verify the cycle selector buttons have light theme styling
- Open notification settings — verify dropdown has light theme colors
- Open statistics modal — verify modal, metric cards, and period selector have light theme colors
- Verify chart bars use theme-appropriate colors
- Close the statistics modal

### 6. Switch to Ocean Breeze Theme
- Click the palette icon button
- Select "Ocean Breeze" theme
- Verify the accent colors change to teal/cyan scheme for work cycle
- Verify short break uses amber/yellow tones
- Verify long break uses violet/purple tones
- Verify text remains white
- Take screenshot: `ocean-breeze-theme.png`

### 7. Ocean Breeze Global Application
- Verify all components reflect the ocean theme
- Open notification settings — verify theme colors
- Open statistics modal — verify theme colors
- Close the statistics modal

### 8. Return to Default Dark Theme
- Click the palette icon button
- Select "Default Dark" theme
- Verify the appearance returns to the original rose/red gradient
- Verify the app looks identical to the initial load state

### 9. Theme Persistence
- Select "Light" theme
- Refresh the page (F5 / Ctrl+R)
- Verify the app loads with the "Light" theme (not Default Dark)
- Verify localStorage key `pomodoro-theme` contains `"light"`

### 10. Functionality After Theme Change
- In any non-default theme, start the timer
- Verify the timer counts down correctly
- Pause and reset the timer
- Switch cycle types (Work, Short Break, Long Break)
- Verify gradient backgrounds change per cycle type in the current theme
- Trigger a notification — verify the notification banner displays with theme-appropriate colors

### 11. Theme Change During Active States
- Start the timer and while it's running, switch themes
- Verify the timer continues uninterrupted
- Verify only colors change, not layout or spacing
- Open the statistics modal and switch themes while it's open
- Verify the modal updates colors in real-time

### 12. Contrast and Readability
- In each theme, verify:
  - Timer digits are clearly readable
  - Button text is clearly readable
  - Statistics modal text and numbers are readable
  - Notification banner text is readable
  - Cycle selector labels are distinguishable

## Expected Results
- All 3 themes are available and selectable
- Theme changes apply instantly across all components
- Default Dark theme matches pre-feature appearance
- Theme persists across page refresh via localStorage
- No functional regressions in any theme
- Sufficient contrast for readability in all themes
- Layout and spacing remain unchanged across themes
