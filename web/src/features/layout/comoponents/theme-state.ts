import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { transitionManager } from '@/utils/transition-manager'

export type Accent = 'green' | 'blue' | 'pink' | 'red'
type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  accent: Accent
  setAccent: (newAccent: Accent) => void
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

const ACCENT_CLASSES = ['green', 'blue', 'pink', 'red']

export const useThemeStore = create<ThemeProviderState>()(
  persist(
    (set, get) => {
      return {
        theme: get()?.theme || 'system',
        accent: get()?.accent || 'green',
        setAccent: (newAccent) => {
          const root = window.document.documentElement
          root.classList.remove(...ACCENT_CLASSES)
          root.classList.add(newAccent)

          return set({ accent: newAccent })
        },
        setTheme: (newTheme) => {
          const transitions = transitionManager()
          transitions.disable()
          const root = window.document.documentElement

          root.classList.remove('light', 'dark')

          if (newTheme === 'system') {
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)',
            ).matches
              ? 'dark'
              : 'light'

            root.classList.add(systemTheme)
            window.requestAnimationFrame(transitions.enable)
            return set({ theme: newTheme })
          }

          root.classList.add(newTheme)
          window.requestAnimationFrame(transitions.enable)
          return set({ theme: newTheme })
        },
      }
    },
    {
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            return
          }

          const root = window.document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.remove(...ACCENT_CLASSES)
          root.classList.add(state?.accent || 'green')

          if (state?.theme === 'system') {
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)',
            ).matches
              ? 'dark'
              : 'light'

            root.classList.add(systemTheme)
            return
          }

          root.classList.add(state?.theme || 'light')
        }
      },
      name: 'theme',
    },
  ),
)
