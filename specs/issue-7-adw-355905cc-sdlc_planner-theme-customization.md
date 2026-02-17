# Feature: Theme Customization

## Metadata
issue_number: `7`
adw_id: `355905cc`
issue_json: ``

## Feature Description
Implement a visual theme system that allows users to switch between multiple predefined color themes. The system uses CSS custom properties (design tokens) to control all visual styling — backgrounds, text colors, accents, card surfaces, borders, and chart colors — so that changing a theme instantly applies globally across the entire UI. The feature includes at least 3 predefined themes (Default Dark, Light, and an alternative accent theme), a theme selector UI accessible from the settings area, and localStorage persistence for the selected theme. Themes only affect appearance (colors and visual styling) and must not alter layout, spacing, or functionality. The architecture is designed for easy extensibility so new themes can be added by simply defining a new set of token values.

## User Story
As a Pomodoro timer user
I want to choose from multiple color themes for the application
So that I can personalize the visual experience to my preference, reduce eye strain, or match my working environment

## Problem Statement
Currently, the Pomodoro timer app has a single fixed color scheme with hardcoded gradient backgrounds per cycle type and `bg-white/XX` opacity-based glassmorphism throughout all components. Users have no ability to customize the visual appearance. Some users may prefer a lighter theme for daytime use, a different accent color scheme for personal taste, or need better contrast for accessibility. The existing color values are scattered across individual component files, making it difficult to change the overall look without editing every component.

## Solution Statement
Introduce a CSS custom properties–based theme system that centralizes all color decisions into semantic design tokens (e.g., `--color-bg-primary`, `--color-text-primary`, `--color-accent`). Define at least 3 complete theme presets as TypeScript objects that map token names to CSS color values. Create a `useTheme` hook backed by React context that manages the active theme, applies it by setting CSS variables on `document.documentElement`, and persists the selection in localStorage. Add a theme selector UI (palette icon button + dropdown) in the top bar. Refactor all existing components to use the CSS variables instead of hardcoded Tailwind color classes, preserving the existing visual output under the "Default Dark" theme. This approach ensures theme changes apply globally and instantly, and new themes can be added by simply creating a new token-value mapping object.

## Relevant Files
Use these files to implement the feature:

- **`src/index.css`** — Global stylesheet. Will define the base CSS custom properties and their default values. The `:root` selector here is where tokens get their initial/fallback values.
- **`src/main.tsx`** — Application entry point. Will wrap `<App />` in the `ThemeProvider` context.
- **`src/App.tsx`** — Root app component. Minimal changes needed since provider wraps it from `main.tsx`.
- **`src/components/PomodoroTimer.tsx`** — Main container. Hardcoded gradient classes (`from-rose-500 to-red-600`, etc.) will be replaced with CSS variable–driven backgrounds. The top-bar buttons (stats, settings) will use token-based colors.
- **`src/components/TimerDisplay.tsx`** — Timer text uses `text-white`. Will use `--color-text-primary` token.
- **`src/components/TimerControls.tsx`** — Button styles use `bg-white/20`, `text-white`. Will use surface/text tokens.
- **`src/components/CycleSelector.tsx`** — Tab buttons use `bg-white/30`, `bg-white/10`, `text-white`. Will use token-based colors.
- **`src/components/NotificationBanner.tsx`** — Uses `CYCLE_BG` record with hardcoded colors. Will use accent tokens per cycle.
- **`src/components/NotificationSettings.tsx`** — Settings dropdown uses `bg-white/20`, `text-white`. Will use surface/text tokens.
- **`src/components/StatisticsModal.tsx`** — Modal uses `bg-white/20 backdrop-blur-lg`, `text-white`, `bg-white/10`. Will use surface/text/card tokens.
- **`src/components/StatisticsChart.tsx`** — Chart bars use `bg-white/50`. Will use chart color token.
- **`tailwind.config.js`** — Will extend theme colors to reference CSS custom properties so Tailwind utility classes can use design tokens.
- **`package.json`** — No new dependencies needed.

### New Files
- **`src/types/theme.ts`** — TypeScript types for `ThemeName`, `ThemeTokens`, and theme preset definitions. Contains all 3+ theme objects as exported constants.
- **`src/context/ThemeContext.tsx`** — React context and `ThemeProvider` component that manages the active theme state, applies CSS variables to the DOM, and persists the selection to localStorage.
- **`src/hooks/useTheme.ts`** — Custom hook that exposes `themeName`, `setTheme`, and `availableThemes` from context.
- **`.claude/commands/e2e/test_theme_customization.md`** — E2E test specification for validating theme switching.

## Implementation Plan
### Phase 1: Foundation
Define the theme type system and design tokens. Create TypeScript types that enumerate available themes, define the shape of a theme's token set, and export 3 complete theme presets. Each preset maps semantic token names to concrete CSS color values. This is the single source of truth for all theme color decisions.

### Phase 2: Core Implementation
Build the theme infrastructure: the React context provider that reads the stored theme from localStorage, applies CSS custom properties to `document.documentElement`, and provides `setTheme` to descendants. Create the `useTheme` hook for easy consumption. Add a theme selector UI (palette icon button with dropdown menu) to the PomodoroTimer component. Update `index.css` to define fallback values for all tokens in `:root`.

### Phase 3: Integration
Refactor every existing component to replace hardcoded Tailwind color classes with CSS variable references. The `CYCLE_COLORS` and `CYCLE_BG` records in PomodoroTimer and NotificationBanner will use CSS variable values. All `bg-white/XX` glass effects, `text-white`, and other color classes will be replaced with token-driven equivalents. The visual result under the "Default Dark" theme must be identical to the current appearance, ensuring zero visual regression.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `.claude/commands/e2e/test_theme_customization.md` with detailed test steps.
- Test steps should cover:
  - Default theme loads correctly (Default Dark)
  - Theme selector button is visible and accessible
  - Clicking the theme selector opens a dropdown with at least 3 theme options
  - Selecting "Light" theme changes all backgrounds, text, and accent colors appropriately
  - Selecting "Ocean Breeze" (or alternative accent theme) changes the accent color scheme
  - Selecting "Default Dark" returns to the original appearance
  - Theme changes apply globally: timer display, controls, cycle selector, notification settings, statistics modal, notification banner all reflect the new theme
  - Theme preference persists in localStorage across page refresh
  - Closing and reopening the theme selector dropdown works correctly
  - All existing functionality (timer, notifications, statistics) continues to work after theme change
  - Sufficient contrast/readability in all themes
  - Take screenshots for each theme

### Step 2: Define theme types and presets
- Create `src/types/theme.ts` with:
  - `ThemeName` type: `'dark' | 'light' | 'ocean'` (union of available theme identifiers).
  - `ThemeTokens` interface containing all semantic token properties:
    - `--color-bg-primary`: main page background
    - `--color-bg-secondary`: secondary/card background
    - `--color-bg-surface`: glass surface background (for modals, dropdowns, cards)
    - `--color-bg-surface-hover`: hover state for surfaces
    - `--color-bg-surface-active`: active/selected state for surfaces
    - `--color-text-primary`: main text color
    - `--color-text-secondary`: muted/secondary text color
    - `--color-text-muted`: very subtle text (labels, placeholders)
    - `--color-accent-work`: accent gradient start for work cycle
    - `--color-accent-work-end`: accent gradient end for work cycle
    - `--color-accent-short-break`: accent gradient start for short break
    - `--color-accent-short-break-end`: accent gradient end for short break
    - `--color-accent-long-break`: accent gradient start for long break
    - `--color-accent-long-break-end`: accent gradient end for long break
    - `--color-border`: border/separator color
    - `--color-chart-bar`: chart bar color
    - `--color-chart-bar-hover`: chart bar hover color
    - `--color-notification-work`: notification background for work cycle
    - `--color-notification-short-break`: notification background for short break
    - `--color-notification-long-break`: notification background for long break
    - `--color-toggle-on`: toggle switch on color
    - `--color-toggle-off`: toggle switch off color
  - `ThemePreset` interface: `{ name: ThemeName; label: string; tokens: ThemeTokens }`
  - `THEMES` constant: a `Record<ThemeName, ThemePreset>` containing three presets:
    - **`dark`**: "Default Dark" — mirrors the current app appearance. Work cycle: rose-500→red-600 gradients. Short break: emerald-500→green-600. Long break: sky-500→blue-600. Surfaces: `rgba(255,255,255,0.2)` for glass effect. Text: white. Chart bars: `rgba(255,255,255,0.5)`.
    - **`light`**: "Light" — light gray/white backgrounds. Work cycle: warm red/rose tones. Short break: green tones. Long break: blue tones. Surfaces: `rgba(255,255,255,0.85)` with subtle shadow. Text: slate-800/slate-600. Chart bars: accent-colored.
    - **`ocean`**: "Ocean Breeze" — deep teal/cyan palette. Work cycle: teal-500→cyan-600 gradients. Short break: amber-400→yellow-500. Long break: violet-500→purple-600. Surfaces: `rgba(255,255,255,0.15)`. Text: white. Chart bars: `rgba(255,255,255,0.5)`.
  - `THEME_NAMES` constant: array `['dark', 'light', 'ocean'] as const` for iteration.
  - `DEFAULT_THEME` constant: `'dark' as ThemeName`.

### Step 3: Create ThemeContext and ThemeProvider
- Create `src/context/ThemeContext.tsx`:
  - Define `ThemeContextValue` type: `{ themeName: ThemeName; setTheme: (name: ThemeName) => void }`.
  - Create `ThemeContext` with `createContext<ThemeContextValue | null>(null)`.
  - Create `ThemeProvider` component:
    - State: `themeName` initialized from localStorage key `'pomodoro-theme'`, falling back to `DEFAULT_THEME`. Validate the stored value is a valid `ThemeName` before using it.
    - `useEffect` that runs whenever `themeName` changes:
      1. Gets the `ThemePreset` for the current name from `THEMES`.
      2. Iterates over all token entries in `preset.tokens` and calls `document.documentElement.style.setProperty(tokenName, tokenValue)` for each.
      3. Persists the theme name to localStorage key `'pomodoro-theme'`.
    - Provides `{ themeName, setTheme }` via context.
  - Export `ThemeProvider` and `ThemeContext`.

### Step 4: Create useTheme hook
- Create `src/hooks/useTheme.ts`:
  - Import `ThemeContext` from context file and `THEMES`, `THEME_NAMES` from types.
  - Return `{ themeName, setTheme, availableThemes: THEME_NAMES }` from context.
  - Throw an error if used outside `ThemeProvider`.

### Step 5: Update index.css with CSS custom property defaults
- Update `src/index.css` to add CSS custom properties in `:root` with the dark theme values as defaults:
  - All token names from `ThemeTokens` with their dark theme values.
  - This ensures the app looks correct even before JavaScript hydrates the theme.
- Keep existing font and body styles.

### Step 6: Wrap App in ThemeProvider
- Update `src/main.tsx`:
  - Import `ThemeProvider` from `../context/ThemeContext`.
  - Wrap `<App />` with `<ThemeProvider>` inside `<React.StrictMode>`.

### Step 7: Add theme selector UI to PomodoroTimer
- Update `src/components/PomodoroTimer.tsx`:
  - Import `useTheme` hook.
  - Import `THEMES` from types.
  - Add state for theme dropdown visibility: `const [isThemeOpen, setIsThemeOpen] = useState(false)`.
  - Add a palette icon button next to the existing stats and settings buttons in the top area. Position it fixed in the top bar (e.g., `fixed top-4 left-16 z-40` — to the right of the stats button).
  - The button uses the same styling pattern as existing buttons: `p-2.5 rounded-xl` with CSS variable–driven background/text colors.
  - When clicked, toggle a dropdown showing the available themes as selectable options.
  - Each option shows the theme label and a visual indicator (small colored circle or checkmark for the active theme).
  - Clicking a theme option calls `setTheme(name)` and closes the dropdown.
  - Close dropdown when clicking outside (use a click-away handler).

### Step 8: Refactor PomodoroTimer to use CSS variables
- Update `src/components/PomodoroTimer.tsx`:
  - Replace the `CYCLE_COLORS` record's Tailwind gradient classes with inline styles using CSS variables:
    - `work`: `background: linear-gradient(to bottom right, var(--color-accent-work), var(--color-accent-work-end))`
    - `shortBreak`: `background: linear-gradient(to bottom right, var(--color-accent-short-break), var(--color-accent-short-break-end))`
    - `longBreak`: `background: linear-gradient(to bottom right, var(--color-accent-long-break), var(--color-accent-long-break-end))`
  - Replace `text-white` and `text-white/70` with CSS variable references using inline styles or a utility class that references `var(--color-text-primary)` and `var(--color-text-secondary)`.
  - Replace `bg-white/20` on buttons with `background: var(--color-bg-surface)` and `bg-white/30` hover with `var(--color-bg-surface-hover)`.

### Step 9: Refactor TimerDisplay to use CSS variables
- Update `src/components/TimerDisplay.tsx`:
  - Replace `text-white` with inline style `color: var(--color-text-primary)`.

### Step 10: Refactor TimerControls to use CSS variables
- Update `src/components/TimerControls.tsx`:
  - Replace `bg-white/20` with `background: var(--color-bg-surface)`.
  - Replace `hover:bg-white/30` with CSS variable hover (use a CSS class in `index.css` or inline approach).
  - Replace `text-white` with `color: var(--color-text-primary)`.

### Step 11: Refactor CycleSelector to use CSS variables
- Update `src/components/CycleSelector.tsx`:
  - Replace `bg-white/30` (active) with `background: var(--color-bg-surface-active)`.
  - Replace `bg-white/10` (inactive) with a lighter surface variant.
  - Replace `hover:bg-white/20` with `var(--color-bg-surface-hover)`.
  - Replace `text-white` with `color: var(--color-text-primary)`.

### Step 12: Refactor NotificationBanner to use CSS variables
- Update `src/components/NotificationBanner.tsx`:
  - Replace the `CYCLE_BG` record with CSS variable references:
    - `work`: `var(--color-notification-work)`
    - `shortBreak`: `var(--color-notification-short-break)`
    - `longBreak`: `var(--color-notification-long-break)`
  - Replace `text-white` with `var(--color-text-primary)`.
  - Replace `text-white/80` with `var(--color-text-secondary)`.

### Step 13: Refactor NotificationSettings to use CSS variables
- Update `src/components/NotificationSettings.tsx`:
  - Replace `bg-white/20` on button and dropdown with `var(--color-bg-surface)`.
  - Replace `hover:bg-white/30` with `var(--color-bg-surface-hover)`.
  - Replace `text-white` with `var(--color-text-primary)`.
  - Replace toggle colors: `bg-white/40` (on) with `var(--color-toggle-on)`, `bg-white/15` (off) with `var(--color-toggle-off)`.

### Step 14: Refactor StatisticsModal to use CSS variables
- Update `src/components/StatisticsModal.tsx`:
  - Replace `bg-white/20 backdrop-blur-lg` on modal with `var(--color-bg-surface)` + backdrop-blur.
  - Replace `bg-white/10` on metric cards with `var(--color-bg-secondary)`.
  - Replace `text-white` with `var(--color-text-primary)`.
  - Replace `text-white/70` with `var(--color-text-secondary)`.
  - Replace `bg-white/30` (active period) with `var(--color-bg-surface-active)`.
  - Replace `bg-white/10` (inactive period) with lighter surface.
  - Replace `hover:bg-white/20` with `var(--color-bg-surface-hover)`.

### Step 15: Refactor StatisticsChart to use CSS variables
- Update `src/components/StatisticsChart.tsx`:
  - Replace `bg-white/50` on bars with `var(--color-chart-bar)`.
  - Replace `hover:bg-white/70` on bars with `var(--color-chart-bar-hover)`.
  - Replace `text-white/50` on empty state and labels with `var(--color-text-muted)`.

### Step 16: Run validation commands
- Run `npm run build` to verify TypeScript compilation and build with zero errors.
- Run `npm run lint` to verify code quality.
- Run `npm run format:check` to verify code formatting.
- Run `npm run dev` to start the development server.
- Manually test in browser at http://localhost:5173:
  - Verify the app loads with the Default Dark theme (identical appearance to current).
  - Verify the theme selector (palette icon) button is visible in the top bar area.
  - Click the palette button and verify a dropdown shows 3 themes: "Default Dark", "Light", "Ocean Breeze".
  - Select "Light" theme — verify all backgrounds change to light colors, text becomes dark, surfaces become white/light.
  - Verify the timer display, controls, cycle selector, notification settings panel, and statistics modal all reflect the light theme.
  - Select "Ocean Breeze" theme — verify the accent colors change to teal/cyan scheme.
  - Select "Default Dark" — verify the appearance returns to the original.
  - Refresh the page — verify the last selected theme persists.
  - Run a full timer cycle (start, pause, reset) in each theme to verify no functional regressions.
  - Open the statistics modal in each theme and verify readability.
  - Trigger a notification in each theme and verify the banner displays correctly.
  - Verify sufficient contrast in all themes (text readable, buttons distinguishable).

## Testing Strategy
### Unit Tests
- **Theme types**: Verify all 3 theme presets define every required token in `ThemeTokens`. Verify `THEME_NAMES` matches the keys of `THEMES`.
- **`useTheme` hook**: Verify it returns the current theme name and setTheme function. Verify it throws when used outside `ThemeProvider`.
- **`ThemeProvider`**: Verify it reads from localStorage on mount. Verify it sets CSS custom properties on `document.documentElement`. Verify it persists theme changes to localStorage. Verify it falls back to `DEFAULT_THEME` for invalid stored values.
- **Theme selector UI**: Verify dropdown opens/closes on button click. Verify clicking a theme option calls `setTheme` with correct name. Verify active theme has a visual indicator.

### Edge Cases
- No theme stored in localStorage (fresh user) — should default to "dark" theme.
- Invalid/corrupted theme name in localStorage (e.g., `"invalid"`) — should fall back to "dark" theme.
- localStorage unavailable — should work in-memory with "dark" default, fail gracefully on persistence.
- Rapid theme switching — CSS variables should update instantly without visual glitches.
- Theme change while timer is running — timer should continue unaffected; only colors change.
- Theme change while statistics modal is open — modal colors should update in real-time.
- Theme change while notification banner is visible — banner should update colors immediately.
- Browser resize/responsive layout — theme tokens only control colors, layout should remain unchanged.
- System prefers-color-scheme changes — not handled (explicit user selection takes priority), but could be added later.

## Acceptance Criteria
1. At least 3 predefined themes are available: Default Dark, Light, and an alternative accent theme (Ocean Breeze).
2. A theme selector button (palette icon) is visible and accessible in the top bar area of the application.
3. Clicking the theme selector shows a dropdown with all available themes clearly labeled.
4. Selecting a theme immediately updates all colors across the entire UI — backgrounds, text, accents, surfaces, borders, chart colors.
5. The "Default Dark" theme produces a visual appearance identical to the current/pre-change app.
6. The "Light" theme has light backgrounds, dark text, and warm accent colors with sufficient contrast.
7. The "Ocean Breeze" theme has a teal/cyan color scheme with distinct visual identity.
8. Theme preference persists in localStorage and survives page refresh.
9. Theme changes do not affect layout, spacing, functionality, or animations.
10. All existing features (timer, notifications, statistics) work correctly in every theme.
11. Colors are controlled via CSS custom properties (semantic design tokens), not hardcoded in components.
12. New themes can be added by defining a new `ThemePreset` object without modifying component code.
13. The feature compiles with zero TypeScript errors (`npm run build` succeeds).
14. Sufficient contrast for readability is maintained across all themes (WCAG AA where possible).
15. The theme selector does not obstruct or conflict with existing UI elements (stats button, settings button).

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run build` - Run build to validate the feature compiles with zero errors
- `npm run lint` - Run linting to validate code quality and style compliance
- `npm run format:check` - Run Prettier format check to ensure consistent code formatting
- `npm run dev` - Start development server and manually test the feature
- Test in browser at http://localhost:5173
- Manually verify in browser:
  - App loads with Default Dark theme (visual parity with current appearance)
  - Theme selector button visible in top bar and clickable
  - Dropdown shows 3 themes: "Default Dark", "Light", "Ocean Breeze"
  - Selecting "Light" changes all colors to light scheme — backgrounds, text, surfaces, accents
  - Selecting "Ocean Breeze" changes accent colors to teal/cyan scheme
  - Selecting "Default Dark" returns to original appearance
  - Timer display, controls, cycle selector reflect selected theme
  - Notification settings dropdown reflects selected theme
  - Statistics modal reflects selected theme (open modal, check colors)
  - Notification banner reflects selected theme (trigger a notification)
  - Chart bars in statistics modal use theme colors
  - Refresh page — theme persists
  - Timer start/pause/reset works in all themes
  - All existing functionality is unaffected

## Notes
- **No new npm dependencies required.** The theme system is built entirely with CSS custom properties, React context, and TypeScript. No theming library (e.g., styled-components, theme-ui) is needed.
- **CSS custom properties approach**: Using `document.documentElement.style.setProperty()` to apply themes at runtime is performant and works with Tailwind CSS. Components reference tokens via `var(--token-name)` in inline styles or custom CSS classes. This avoids the need to dynamically generate Tailwind classes which would require safelisting.
- **Inline styles vs CSS classes**: Since Tailwind generates classes at build time and cannot handle dynamic CSS variable values in class names (e.g., `bg-[var(--color)]` requires safelisting), the refactored components will use inline `style` attributes for color properties that reference CSS variables. Non-color Tailwind classes (padding, margins, flexbox, animations, etc.) remain unchanged.
- **Glassmorphism in light theme**: The light theme adjusts surface colors to use semi-transparent white with higher opacity (`rgba(255,255,255,0.85)`) and may add subtle box-shadow instead of relying solely on backdrop-blur for depth. Backdrop-blur is kept for all themes.
- **Design token naming convention**: All tokens follow `--color-{category}-{variant}` pattern (e.g., `--color-bg-primary`, `--color-text-secondary`, `--color-accent-work`). This semantic naming ensures tokens describe their purpose, not their value.
- **Future extensibility**: New themes can be added by: (1) adding a new name to the `ThemeName` union, (2) creating a `ThemePreset` object with all tokens filled, (3) adding it to the `THEMES` record. No component changes needed. Could also support user-created custom themes in a future iteration.
- **Theme selector position**: The theme selector button is placed in the top bar alongside the existing statistics and notification settings buttons. Consider grouping all three buttons for visual consistency.
