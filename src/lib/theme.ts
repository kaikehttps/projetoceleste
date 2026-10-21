import { useCallback, useState } from 'react'

export type Theme = 'dark' | 'light'

const KEY = 'celeste-theme'

const THEME_COLOR: Record<Theme, string> = { dark: '#0e0b12', light: '#f1e9e0' }

function current(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current)

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* armazenamento indisponível (aba anônima etc.): o tema vale só nesta visita */
    }
    setTheme(next)
  }, [])

  return { theme, toggle }
}
