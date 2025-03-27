import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { transitionManager } from '@/utils/transition-manager'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

export const useThemeStore = create<ThemeProviderState>()(
  persist(
    (set, get) => {
      return {
        theme: get()?.theme || 'system',
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
