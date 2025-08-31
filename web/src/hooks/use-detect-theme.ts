import { useEffect } from 'react'

import { usePreferencesStore } from '@/features/layout/stores/preferences-store'

export const useDetectTheme = () => {
  const themeState = usePreferencesStore((n) => n.theme)

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
    const themeClassName = darkModePreference.matches ? 'dark' : 'light'
    const root = window.document.documentElement

    const setThemeOnChange = (e: MediaQueryListEvent) => {
      if (themeState !== 'system') {
        return
      }

      root.classList.remove('light', 'dark')

      if (e.matches) {
        root.classList.add('dark')
        return
      }

      root.classList.add('light')
    }

    darkModePreference.addEventListener('change', setThemeOnChange)

    if (themeState === 'system') {
      root.classList.add(themeClassName)
    }

    return () => {
      darkModePreference.removeEventListener('change', setThemeOnChange)
    }
  }, [themeState])
}
