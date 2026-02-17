import { useState, useEffect, ReactNode } from 'react'
import { ThemeName, ThemeTokens, THEMES, THEME_NAMES, DEFAULT_THEME } from '../types/theme'
import { ThemeContext } from './themeContextValue'

function isValidThemeName(value: string): value is ThemeName {
  return (THEME_NAMES as readonly string[]).includes(value)
}

function getStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem('pomodoro-theme')
    if (stored && isValidThemeName(stored)) return stored
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(getStoredTheme)

  useEffect(() => {
    const preset = THEMES[themeName]
    const root = document.documentElement
    const entries = Object.entries(preset.tokens) as [keyof ThemeTokens, string][]
    for (const [token, value] of entries) {
      root.style.setProperty(token, value)
    }
    try {
      localStorage.setItem('pomodoro-theme', themeName)
    } catch {
      // localStorage unavailable
    }
  }, [themeName])

  return (
    <ThemeContext.Provider value={{ themeName, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  )
}
