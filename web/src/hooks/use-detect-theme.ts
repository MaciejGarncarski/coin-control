import { useEffect } from 'react'

import { useThemeStore } from '@/features/layout/comoponents/theme-state'

export const useDetectTheme = () => {
  const themeState = useThemeStore((n) => n.theme)

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

    root.classList.add(themeClassName)
    darkModePreference.addEventListener('change', setThemeOnChange)

    return () => {
      darkModePreference.removeEventListener('change', setThemeOnChange)
    }
  }, [themeState])
}
