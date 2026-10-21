import { useRef } from 'react'
import { ArrowDown, Headphones } from 'lucide-react'
import { Fog } from '../components/art/Fog'
import { NearStreet, StarField, WatchingMoon } from '../components/art/HeroArt'
import { SkylineLayer } from '../components/art/SkylineLayer'
import type { SkylineOptions } from '../components/art/skyline'
import { Star4 } from '../components/art/Star4'
import { CelesteLogo } from '../components/Logo'
import { useParallax } from '../lib/useParallax'
import { site } from '../config'
import { delay } from '../lib/style'
import './Hero.css'

const FAR: SkylineOptions = {
  seed: 1927,
  width: 1600,
  height: 560,
  minH: 120,
  maxH: 290,
  minW: 30,
  maxW: 74,
  profile: (t) => 0.75 + 0.45 * Math.sin(t * Math.PI),
  landmarks: [
    { x: 690, w: 96, h: 540, type: 'empire' },
    { x: 1004, w: 62, h: 470, type: 'chrysler' },
    { x: 300, w: 70, h: 330, type: 'deco' },
  ],
  windows: { density: 0.035, w: 3, h: 4, gx: 5, gy: 7, pink: 0.08 },
  detail: { setback: 0.45, water: 0.1, antenna: 0.25, gothic: 0.06, dome: 0.05, cornice: 0.4 },
}

const MID: SkylineOptions = {
  seed: 31,
  width: 1600,
  height: 420,
  minH: 90,
  maxH: 230,
  minW: 46,
  maxW: 124,
  // mais baixa à esquerda, onde fica o texto do hero
  profile: (t) => (t < 0.42 ? 0.5 + t * 0.6 : 0.82 + 0.26 * Math.cos(t * Math.PI * 2.4)),
  landmarks: [
    { x: 1128, w: 50, h: 320, type: 'gothic' },
    { x: 1360, w: 110, h: 290, type: 'deco' },
  ],
  windows: { density: 0.05, w: 3, h: 5, gx: 7, gy: 9, pink: 0.12 },
  detail: { setback: 0.35, water: 0.32, antenna: 0.12, gothic: 0.05, cornice: 0.6 },
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  useParallax(ref)

  return (
    <section className="hero scene" id="inicio" ref={ref} aria-labelledby="hero-title">
      <div className="hero__art" aria-hidden="true">
        <div className="hero__sky" />
        <StarField className="hero__stars" />
        <div className="hero__beams">
          <span className="hero__beam hero__beam--a" />
          <span className="hero__beam hero__beam--b" />
        </div>
        <WatchingMoon className="hero__moon" />
        <SkylineLayer className="hero__far" options={FAR} fill="var(--city-far)" windows={0.35} blinking={2} />
        <Fog className="hero__fog-back" variant="a" speed={160} />
        <SkylineLayer className="hero__mid" options={MID} fill="var(--city-mid)" windows={0.8} blinking={1} />
        <Fog className="hero__fog-mid" variant="b" speed={120} reverse />
        <NearStreet className="hero__near" />
        <Fog className="hero__fog-front" variant="a" speed={90} />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content container">
        <div className="hero__kicker label-row" data-reveal style={delay(1)}>
          <span className="label label--accent">Nova York</span>
          <span className="rule" />
          <span className="label">A cidade que nunca dorme</span>
        </div>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__title-main display" data-reveal="rise" style={delay(2)}>
            Deadlock
          </span>
          <span className="hero__title-sub" data-reveal style={delay(4)}>
            <Star4 />
            Fã dublado em PT-BR
            <Star4 />
          </span>
        </h1>

        <div className="hero__copy" data-reveal style={delay(5)}>
          <p className="hero__tagline">Duas vozes. Um universo que nunca dorme.</p>
          <p className="hero__byline">
            Demonstração independente de voz por <strong>{site.author}</strong>.
          </p>
        </div>

        <div className="hero__actions" data-reveal style={delay(6)}>
          <a className="btn btn--primary" href="#vendedor">
            <Headphones aria-hidden="true" />
            Ouvir as demonstrações
          </a>
          <a className="btn" href="#projeto">
            Conhecer o projeto
          </a>
        </div>

        <div className="hero__dedication" data-reveal="fade" style={delay(7)}>
          <span className="label">Uma demonstração para o</span>
          <CelesteLogo className="hero__celeste" />
          <span className="hero__dedication-foot label">Deadlock · Fã dublado em PT-BR</span>
        </div>

        <svg
          className="hero__seal"
          viewBox="0 0 200 200"
          role="img"
          aria-label="Fã dublagem independente · Projeto de demonstração"
        >
          <defs>
            <path id="seal-path" d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0" />
          </defs>
          <circle cx="100" cy="100" r="97" className="hero__seal-ring" />
          <circle cx="100" cy="100" r="58" className="hero__seal-ring hero__seal-ring--dash" />
          <g className="hero__seal-text">
            <text>
              <textPath href="#seal-path" textLength="474" lengthAdjust="spacing">
                FÃ DUBLAGEM INDEPENDENTE · PROJETO DE DEMONSTRAÇÃO ·
              </textPath>
            </text>
          </g>
          <path
            className="hero__seal-star"
            d="M100 66C101.6 88 112 98.4 134 100C112 101.6 101.6 112 100 134C98.4 112 88 101.6 66 100C88 98.4 98.4 88 100 66Z"
          />
        </svg>
      </div>

      <p className="hero__side hero__side--left label" aria-hidden="true">
        40°42′46″N · 74°00′22″W
      </p>
      <p className="hero__side hero__side--right label" aria-hidden="true">
        Uma cidade amaldiçoada · Duas vozes · Uma nova interpretação
      </p>

      <a className="hero__scroll" href="#projeto">
        <span className="label">Continue explorando</span>
        <span className="hero__scroll-line" aria-hidden="true">
          <ArrowDown />
        </span>
      </a>
    </section>
  )
}
