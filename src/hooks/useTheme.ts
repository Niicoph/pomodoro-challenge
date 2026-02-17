import { useContext } from 'react'
import { ThemeContext } from '../context/themeContextValue'
import { THEME_NAMES } from '../types/theme'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return { ...context, availableThemes: THEME_NAMES }
}
