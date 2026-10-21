import { useEffect, useRef, useState } from 'react'
import { Headphones, Music2, VolumeX } from 'lucide-react'
import { music, useMusic } from '../audio/music'
import { site } from '../config'
import { Fog } from './art/Fog'
import { StarField, WatchingMoon } from './art/HeroArt'
import { Star4 } from './art/Star4'
import { CelesteLogo } from './Logo'
import { vars } from '../lib/style'
import './Intro.css'

const TITLE = 'DEADLOCK'
const EXIT_MS = 1300

/**
 * Tela de título, como a de um jogo. O clique em "Entrar" é o gesto que
 * libera a música; enquanto ela está aberta, o resto da página fica inerte.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const { available } = useMusic()
  const [leaving, setLeaving] = useState(false)
  const primary = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('intro-open')
    const t = window.setTimeout(() => primary.current?.focus({ preventScroll: true }), 50)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('intro-open')
    }
  }, [])

  const enter = (withSound: boolean) => {
    if (leaving) return
    if (withSound) music.setEnabled(true)
    setLeaving(true)
    document.documentElement.classList.remove('intro-open')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(onDone, reduce ? 0 : EXIT_MS)
  }

  // ainda verificando o arquivo de música: oferece as duas opções
  const hasMusic = available !== false

  return (
    <div
      className="intro"
      data-leaving={leaving || undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      aria-describedby="intro-desc"
    >
      <div className="intro__bg" aria-hidden="true">
        <StarField className="intro__stars" seed={77} count={150} sparkles={7} />
        <WatchingMoon className="intro__moon" />
        <Fog className="intro__fog" variant="a" speed={120} />
        <Fog className="intro__fog intro__fog--2" variant="b" speed={90} reverse />
        <div className="intro__vignette" />
      </div>

      <div className="intro__content">
        <p className="intro__kicker label">Kaike Alves apresenta</p>

        <h2 className="intro__title" id="intro-title" aria-label="Deadlock — fã dublado em PT-BR">
          <span className="intro__word" aria-hidden="true">
            {[...TITLE].map((ch, i) => (
              <span key={i} style={vars({ '--i': i })}>
                {ch}
              </span>
            ))}
          </span>
          <span className="intro__sub" aria-hidden="true">
            <Star4 />
            Fã dublado em PT-BR
            <Star4 />
          </span>
        </h2>

        <div className="intro__for">
          <span className="label">Uma demonstração de voz para o</span>
          <CelesteLogo className="intro__celeste" />
        </div>

        <p className="intro__desc" id="intro-desc">
          Duas vozes. Um universo que nunca dorme.
        </p>

        <div className="intro__actions">
          {hasMusic ? (
            <>
              <button ref={primary} type="button" className="btn btn--primary intro__enter" onClick={() => enter(true)}>
                <Music2 aria-hidden="true" />
                Entrar com som
              </button>
              <button type="button" className="btn intro__mute" onClick={() => enter(false)}>
                <VolumeX aria-hidden="true" />
                Entrar sem som
              </button>
            </>
          ) : (
            <button ref={primary} type="button" className="btn btn--primary intro__enter" onClick={() => enter(false)}>
              Entrar
            </button>
          )}
        </div>

        <p className="intro__hint">
          <Headphones aria-hidden="true" />
          Para ouvir as vozes do jeito certo, use fones de ouvido.
        </p>
      </div>

      {hasMusic && (
        <p className="intro__credit">
          <Music2 aria-hidden="true" />
          {site.music.title} · {site.music.copyright}
        </p>
      )}
    </div>
  )
}
