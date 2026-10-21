import { useEffect, useState } from 'react'
import { Headphones, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../lib/theme'
import { CelesteLogo } from './Logo'
import './Header.css'

const LINKS = [
  { href: '#projeto', label: 'O projeto' },
  { href: '#demonstracoes', label: 'Demonstrações' },
  { href: '#sobre', label: 'Sobre mim' },
]

export function Header() {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 900 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const themeLabel = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className="site-header__bar">
        <a className="site-header__brand" href="#inicio" aria-label="Projeto Celeste — voltar ao início">
          <CelesteLogo className="site-header__logo" />
        </a>

        <nav className="site-header__nav" aria-label="Principal">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button type="button" className="icon-btn" onClick={toggle} aria-label={themeLabel} title={themeLabel}>
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <a className="btn btn--small site-header__cta" href="#vendedor">
            <Headphones aria-hidden="true" />
            Ouvir demonstrações
          </a>
          <button
            type="button"
            className="icon-btn site-header__menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="site-header__panel" id="menu-mobile" hidden={!open}>
        <nav aria-label="Menu">
          <ol>
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  <span className="label">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a className="btn btn--primary" href="#vendedor" onClick={() => setOpen(false)}>
          <Headphones aria-hidden="true" />
          Ouvir demonstrações
        </a>
      </div>
    </header>
  )
}
