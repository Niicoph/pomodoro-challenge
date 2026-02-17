import { createContext } from 'react'
import { ThemeName } from '../types/theme'

export interface ThemeContextValue {
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
