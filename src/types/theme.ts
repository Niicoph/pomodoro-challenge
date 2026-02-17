export type ThemeName = 'dark' | 'light' | 'ocean'

export interface ThemeTokens {
  '--color-bg-primary': string
  '--color-bg-secondary': string
  '--color-bg-surface': string
  '--color-bg-surface-hover': string
  '--color-bg-surface-active': string
  '--color-text-primary': string
  '--color-text-secondary': string
  '--color-text-muted': string
  '--color-accent-work': string
  '--color-accent-work-end': string
  '--color-accent-short-break': string
  '--color-accent-short-break-end': string
  '--color-accent-long-break': string
  '--color-accent-long-break-end': string
  '--color-border': string
  '--color-chart-bar': string
  '--color-chart-bar-hover': string
  '--color-notification-work': string
  '--color-notification-short-break': string
  '--color-notification-long-break': string
  '--color-toggle-on': string
  '--color-toggle-off': string
}

export interface ThemePreset {
  name: ThemeName
  label: string
  tokens: ThemeTokens
}

export const THEME_NAMES = ['dark', 'light', 'ocean'] as const

export const DEFAULT_THEME: ThemeName = 'dark'

export const THEMES: Record<ThemeName, ThemePreset> = {
  dark: {
    name: 'dark',
    label: 'Default Dark',
    tokens: {
      '--color-bg-primary': '#1a1a2e',
      '--color-bg-secondary': 'rgba(255,255,255,0.1)',
      '--color-bg-surface': 'rgba(255,255,255,0.2)',
      '--color-bg-surface-hover': 'rgba(255,255,255,0.3)',
      '--color-bg-surface-active': 'rgba(255,255,255,0.3)',
      '--color-text-primary': '#ffffff',
      '--color-text-secondary': 'rgba(255,255,255,0.7)',
      '--color-text-muted': 'rgba(255,255,255,0.5)',
      '--color-accent-work': '#f43f5e',
      '--color-accent-work-end': '#dc2626',
      '--color-accent-short-break': '#10b981',
      '--color-accent-short-break-end': '#16a34a',
      '--color-accent-long-break': '#0ea5e9',
      '--color-accent-long-break-end': '#2563eb',
      '--color-border': 'rgba(255,255,255,0.2)',
      '--color-chart-bar': 'rgba(255,255,255,0.5)',
      '--color-chart-bar-hover': 'rgba(255,255,255,0.7)',
      '--color-notification-work': 'rgba(220,38,38,0.9)',
      '--color-notification-short-break': 'rgba(5,150,105,0.9)',
      '--color-notification-long-break': 'rgba(2,132,199,0.9)',
      '--color-toggle-on': 'rgba(255,255,255,0.4)',
      '--color-toggle-off': 'rgba(255,255,255,0.15)',
    },
  },
  light: {
    name: 'light',
    label: 'Light',
    tokens: {
      '--color-bg-primary': '#f8fafc',
      '--color-bg-secondary': 'rgba(255,255,255,0.85)',
      '--color-bg-surface': 'rgba(255,255,255,0.85)',
      '--color-bg-surface-hover': 'rgba(255,255,255,0.95)',
      '--color-bg-surface-active': 'rgba(255,255,255,0.95)',
      '--color-text-primary': '#1e293b',
      '--color-text-secondary': '#475569',
      '--color-text-muted': '#94a3b8',
      '--color-accent-work': '#e11d48',
      '--color-accent-work-end': '#f43f5e',
      '--color-accent-short-break': '#059669',
      '--color-accent-short-break-end': '#10b981',
      '--color-accent-long-break': '#0284c7',
      '--color-accent-long-break-end': '#0ea5e9',
      '--color-border': 'rgba(0,0,0,0.1)',
      '--color-chart-bar': 'rgba(0,0,0,0.25)',
      '--color-chart-bar-hover': 'rgba(0,0,0,0.4)',
      '--color-notification-work': 'rgba(225,29,72,0.9)',
      '--color-notification-short-break': 'rgba(5,150,105,0.9)',
      '--color-notification-long-break': 'rgba(2,132,199,0.9)',
      '--color-toggle-on': 'rgba(0,0,0,0.35)',
      '--color-toggle-off': 'rgba(0,0,0,0.15)',
    },
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean Breeze',
    tokens: {
      '--color-bg-primary': '#0f172a',
      '--color-bg-secondary': 'rgba(255,255,255,0.1)',
      '--color-bg-surface': 'rgba(255,255,255,0.15)',
      '--color-bg-surface-hover': 'rgba(255,255,255,0.25)',
      '--color-bg-surface-active': 'rgba(255,255,255,0.25)',
      '--color-text-primary': '#ffffff',
      '--color-text-secondary': 'rgba(255,255,255,0.7)',
      '--color-text-muted': 'rgba(255,255,255,0.5)',
      '--color-accent-work': '#14b8a6',
      '--color-accent-work-end': '#0891b2',
      '--color-accent-short-break': '#f59e0b',
      '--color-accent-short-break-end': '#eab308',
      '--color-accent-long-break': '#8b5cf6',
      '--color-accent-long-break-end': '#7c3aed',
      '--color-border': 'rgba(255,255,255,0.15)',
      '--color-chart-bar': 'rgba(255,255,255,0.5)',
      '--color-chart-bar-hover': 'rgba(255,255,255,0.7)',
      '--color-notification-work': 'rgba(20,184,166,0.9)',
      '--color-notification-short-break': 'rgba(245,158,11,0.9)',
      '--color-notification-long-break': 'rgba(139,92,246,0.9)',
      '--color-toggle-on': 'rgba(255,255,255,0.4)',
      '--color-toggle-off': 'rgba(255,255,255,0.15)',
    },
  },
}
