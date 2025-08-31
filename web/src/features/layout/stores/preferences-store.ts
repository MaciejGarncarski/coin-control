import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { transitionManager } from '@/utils/transition-manager'

const ACCENT_CLASSES = ['green', 'blue', 'pink', 'red']
const NO_TRANSITIONS_CLASS = 'no-transitions'

export type Accent = 'green' | 'blue' | 'pink' | 'red'
type Theme = 'dark' | 'light' | 'system'

type PreferencesState = {
  accent: Accent
  setAccent: (newAccent: Accent) => void
  theme: Theme
  setTheme: (newTheme: Theme) => void
  transitionsEnabled: boolean
  setTransitionsEnabled: (data: boolean) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => {
      return {
        transitionsEnabled: get()?.transitionsEnabled || true,
        setTransitionsEnabled: (data) => {
          const root = window.document.documentElement
          if (data === false) {
            root.classList.add(NO_TRANSITIONS_CLASS)
          }

          if (data) {
            root.classList.remove(NO_TRANSITIONS_CLASS)
          }

          set({ transitionsEnabled: data })
        },
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

          if (state?.transitionsEnabled === false) {
            root.classList.add(NO_TRANSITIONS_CLASS)
          }

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
