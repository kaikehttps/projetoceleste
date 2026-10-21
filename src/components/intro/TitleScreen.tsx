import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react'
import { ChevronRight, Music2, Volume2, VolumeX } from 'lucide-react'
import { music, useMusic } from '../../audio/music'
import { site } from '../../config'
import { CelesteLogo, DeadlockLockup } from '../Logo'
import { Star4 } from '../art/Star4'
import { Ribbons } from './Ribbons'
import { TitleCity } from './TitleCity'
import { delay } from '../../lib/style'
import './TitleScreen.css'

/**
 * Tela de título, como a do jogo:
 *  1. "Pressione qualquer tecla" — a cidade ao entardecer, em silêncio.
 *  2. Menu — a música entra e as fitas espectrais varrem a tela.
 *  3. Mergulho — a câmera entra na cidade e o site aparece; a música desce
 *     para o volume de fundo.
 * Esc pula direto para o site em qualquer momento.
 */

type Phase = 'title' | 'menu' | 'leaving'

const MENU = [
  { label: 'Entrar na cidade', target: '#inicio', primary: true },
  { label: 'Ouvir as demonstrações', target: '#vendedor' },
  { label: 'Conhecer o projeto', target: '#projeto' },
  { label: 'Sobre mim', target: '#sobre' },
]

const LEAVE_MS = 1750
const IGNORED_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'ContextMenu'])

export function TitleScreen({ onDone }: { onDone: (target: string) => void }) {
  const { available, enabled, blocked } = useMusic()
  const [phase, setPhase] = useState<Phase>('title')
  const [burst, setBurst] = useState(0)
  const phaseRef = useRef<Phase>('title')
  const rootRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const reduce = useRef(false)
  const [touch] = useState(() => window.matchMedia('(hover: none)').matches)
  const hasMusic = available !== false

  // tenta começar a música já na abertura; se o navegador bloquear, entra no primeiro toque/tecla
  useEffect(() => {
    if (available) music.autoStart('menu')
  }, [available])

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('intro-open')
    const t = window.setTimeout(() => startRef.current?.focus({ preventScroll: true }), 80)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('intro-open')
    }
  }, [])

  const begin = useCallback(() => {
    if (phaseRef.current !== 'title') return
    phaseRef.current = 'menu'
    if (hasMusic && music.getState().enabled) music.start('menu')
    setBurst((b) => b + 1)
    setPhase('menu')
    window.setTimeout(() => menuRef.current?.querySelector('button')?.focus({ preventScroll: true }), 700)
  }, [hasMusic])

  const leave = useCallback(
    (target: string) => {
      if (phaseRef.current === 'leaving') return
      phaseRef.current = 'leaving'
      music.setMode('background')
      setPhase('leaving')
      // libera a página por trás: a capa começa a se revelar durante o mergulho
      document.documentElement.classList.remove('intro-open')
      if (target !== '#inicio') document.querySelector(target)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      window.setTimeout(() => onDone(target), reduce.current ? 0 : LEAVE_MS)
    },
    [onDone],
  )

  // qualquer tecla começa; Esc pula tudo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        leave('#inicio')
        return
      }
      if (phaseRef.current !== 'title' || IGNORED_KEYS.has(e.key) || e.repeat) return
      // Enter/Espaço num botão de canto (ex.: som) não devem começar
      const el = document.activeElement
      if (el instanceof HTMLElement && el.closest('.title__corner')) return
      e.preventDefault()
      begin()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [begin, leave])

  // música → luz: graves no brilho do logo e dos raios; 4 faixas no equalizador
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let frame = 0
    let beat = 0
    const avg = [0, 0, 0, 0]
    const last = new Map<string, string>()
    const put = (k: string, v: string) => {
      if (last.get(k) === v) return
      last.set(k, v)
      el.style.setProperty(k, v)
    }
    const loop = () => {
      const b = music.readBands()
      // pulso = quanto os graves passam da média recente (a trilha é muito comprimida)
      for (let i = 0; i < 4; i++) avg[i] += (b[i] - avg[i]) * 0.03
      const pulse = Math.max(0, Math.min(1, (b[0] - avg[0]) * 6 + 0.15 * (b[0] > 0.05 ? 1 : 0)))
      beat += (pulse - beat) * (pulse > beat ? 0.5 : 0.1)
      put('--beat', beat.toFixed(2))
      for (let i = 0; i < 4; i++) {
        const v = Math.max(0, Math.min(1, (b[i] - avg[i] * 0.7) * 3.2))
        put(`--b${i}`, v.toFixed(2))
      }
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [])

  // câmera acompanha o mouse de leve (só com ponteiro fino)
  useEffect(() => {
    const el = rootRef.current
    if (!el || touch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [touch])

  // clicar/tocar em qualquer ponto da tela de título começa
  const onScreenClick = (e: MouseEvent<HTMLDivElement>) => {
    if (phaseRef.current !== 'title') return
    if ((e.target as HTMLElement).closest('.title__corner')) return
    begin()
  }

  // ↑ ↓ percorrem o menu, como num jogo
  const onMenuKey = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...(menuRef.current?.querySelectorAll('button') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const next = items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]
    next?.focus()
  }

  const soundOn = enabled
  const toggleSound = () => {
    if (enabled) music.setEnabled(false)
    else music.start('menu')
  }

  return (
    <div
      ref={rootRef}
      className="title"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Tela de entrada — Deadlock fã dublado em PT-BR"
      onClick={onScreenClick}
    >
      <div className="title__scene">
        <TitleCity />
      </div>
      {burst > 0 && <Ribbons key={`r${burst}`} intense />}
      <div className="title__flash" aria-hidden="true" />

      <div className="title__ui">
        <div className="title__logo">
          <div className="title__logo-in">
            <DeadlockLockup className="title__lockup" />
          </div>
        </div>

        <button
          ref={startRef}
          type="button"
          className="title__start"
          onClick={begin}
          tabIndex={phase === 'title' ? 0 : -1}
          aria-hidden={phase !== 'title' || undefined}
        >
          {touch ? 'Toque para começar' : 'Pressione qualquer tecla para começar'}
        </button>

        {phase !== 'title' && (
          <div className="title__menu-wrap">
            <p className="title__tagline" style={delay(1)}>
              Duas vozes. Um universo que nunca dorme.
            </p>
            <nav aria-label="Menu principal">
              <ul className="title__menu" ref={menuRef} onKeyDown={onMenuKey}>
                {MENU.map((item, i) => (
                  <li key={item.target} style={delay(i + 2)}>
                    <button
                      type="button"
                      className={`title__item${item.primary ? ' title__item--primary' : ''}`}
                      onClick={() => leave(item.target)}
                    >
                      <Star4 className="title__item-star" />
                      <span>{item.label}</span>
                      <ChevronRight className="title__item-arrow" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {!touch && (
              <p className="title__keys" aria-hidden="true" style={delay(7)}>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navegar · <kbd>Enter</kbd> escolher · <kbd>Esc</kbd> entrar direto
              </p>
            )}
          </div>
        )}
      </div>

      {hasMusic && blocked && (
        <p className="title__unmute" role="status">
          <Volume2 aria-hidden="true" />
          Clique em qualquer lugar para ligar o som
        </p>
      )}

      {/* cantos, como os de uma tela de jogo */}
      <p className="title__corner title__corner--tl label">Kaike Alves apresenta</p>

      {hasMusic && (
        <button
          type="button"
          className="title__corner title__corner--tr title__sound"
          data-music-control
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Som ligado — clique para desligar' : 'Som desligado — clique para ligar'}
        >
          {soundOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          <span>{soundOn ? 'Com som' : 'Sem som'}</span>
        </button>
      )}

      <div className="title__corner title__corner--bl">
        <span className="label">Uma demonstração de voz para o</span>
        <CelesteLogo className="title__celeste" />
      </div>

      {hasMusic && (
        <p className="title__corner title__corner--br">
          <span className="title__eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <Music2 aria-hidden="true" />
          <span>
            {site.music.title} · {site.music.copyright}
          </span>
        </p>
      )}
    </div>
  )
}
