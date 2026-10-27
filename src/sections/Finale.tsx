import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Fog } from '../components/art/Fog'
import { StarField } from '../components/art/HeroArt'
import { SkylineLayer } from '../components/art/SkylineLayer'
import type { SkylineOptions } from '../components/art/skyline'
import { STAR4_PATH } from '../components/art/Star4'
import { SealedPlayer } from '../components/player/SealedPlayer'
import { site } from '../config'
import { delay } from '../lib/style'
import './Finale.css'

const CITY: SkylineOptions = {
  seed: 88,
  width: 1600,
  height: 360,
  minH: 60,
  maxH: 210,
  minW: 30,
  maxW: 90,
  profile: (t) => 0.55 + 0.6 * Math.abs(t - 0.5),
  landmarks: [{ x: 300, w: 60, h: 300, type: 'chrysler' }],
  windows: { density: 0.03, w: 3, h: 4, gx: 6, gy: 8, pink: 0.2 },
  detail: { setback: 0.4, water: 0.25, antenna: 0.2, cornice: 0.5 },
}

export function Finale() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section className="finale scene" id="celeste" ref={ref} aria-labelledby="finale-title">
      <div className="finale__art" aria-hidden="true">
        <StarField className="finale__stars" seed={21} count={90} sparkles={0} />
        <svg className="finale__star" viewBox="0 0 200 200" data-reveal>
          <defs>
            <radialGradient id="finale-halo">
              <stop offset="0" stopColor="var(--celeste-lilac)" stopOpacity="0.55" />
              <stop offset="0.35" stopColor="var(--celeste-pink)" stopOpacity="0.18" />
              <stop offset="1" stopColor="var(--celeste-pink)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#finale-halo)" className="finale__halo" />
          <path d={STAR4_PATH} transform="translate(100 100) scale(2.4) translate(-12 -12)" fill="var(--celeste-white)" />
        </svg>
        <SkylineLayer className="finale__city" options={CITY} fill="var(--city-far)" windows={0.6} blinking={1} />
        <Fog className="finale__fog" variant="a" speed={150} />
        <Fog className="finale__fog finale__fog--2" variant="b" speed={110} reverse />
      </div>

      <div className="container finale__grid">
        <div className="finale__head">
          <div className="label-row finale__eyebrow" data-reveal>
            <span className="label">Epílogo</span>
            <span className="rule" />
            <span className="label">Uma mensagem para o Projeto Celeste</span>
          </div>
          <h2 className="finale__title" id="finale-title">
            <span data-reveal="rise" style={delay(1)}>
              A cidade
            </span>
            <span data-reveal="rise" style={delay(3)}>
              nunca dorme.
            </span>
            <em data-reveal="rise" style={delay(5)}>
              Eu também não.
            </em>
          </h2>
        </div>

        <div className="finale__body" data-reveal style={delay(2)}>
          <p className="finale__thanks">Obrigado por dedicar um pouco do seu tempo a esta demonstração.</p>
          <p>
            Seria muito especial ter a oportunidade de conhecer melhor o Projeto Celeste e, quem sabe, colaborar com a
            equipe no futuro. E, além da voz, sou desenvolvedor: se algum dia precisarem de uma mão com programação,
            também estou à disposição.
          </p>
        </div>

        <div className="finale__side" data-reveal style={delay(3)}>
          <div className="finale__farewell">
            <p className="label">Última gravação</p>
            <SealedPlayer label="Despedida · Kaike" tone="dark" />
          </div>

          {(site.projectCelesteUrl || site.contacts.length > 0) && (
            <div className="finale__actions">
              {site.projectCelesteUrl && (
                <a className="btn btn--primary" href={site.projectCelesteUrl} target="_blank" rel="noreferrer">
                  Conhecer o Projeto Celeste
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}
              {site.contacts.map((c) => (
                <a key={c.href} className="btn" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {c.label}
                </a>
              ))}
            </div>
          )}
          {import.meta.env.DEV && !site.projectCelesteUrl && (
            <p className="finale__dev-note">
              (Só no modo de desenvolvimento) Adicione o link do Projeto Celeste em <code>src/config.ts</code> para
              exibir o botão “Conhecer o Projeto Celeste”.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
