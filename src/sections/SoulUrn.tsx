import { useRef } from 'react'
import { Fog } from '../components/art/Fog'
import { SpiritUrn } from '../components/art/SpiritUrn'
import { UrnStreet } from '../components/art/UrnStreet'
import { VoicePlayer } from '../components/player/VoicePlayer'
import { useIsPlaying, useVoiceGlow } from '../audio/hooks'
import { urnTrack } from '../data/recordings'
import { delay } from '../lib/style'
import './SoulUrn.css'

const PLAYER_ID = 'urna'

export function SoulUrn() {
  const ref = useRef<HTMLElement>(null)
  useVoiceGlow(ref, [PLAYER_ID], '.urn__glow')
  const playing = useIsPlaying([PLAYER_ID])

  return (
    <section className="urn scene" id="urna" ref={ref} data-playing={playing || undefined} aria-labelledby="urn-title">
      <div className="urn__backdrop" aria-hidden="true">
        <UrnStreet className="urn__street" />
        <Fog className="urn__fog-a" variant="a" speed={130} />
        <Fog className="urn__fog-b" variant="b" speed={95} reverse />
        <div className="urn__shade" />
      </div>

      <header className="container urn__head">
        <div className="label-row urn__eyebrow" data-reveal>
          <span className="label">Registro de voz Nº 002</span>
          <span className="rule" />
          <span className="label">Artefato</span>
        </div>
        <h2 className="urn__title" id="urn-title" data-reveal="rise" style={delay(1)}>
          Soul Urn
        </h2>
      </header>

      <div className="container urn__grid">
        <div className="urn__intro">
          <div className="urn__names" data-reveal>
            <p className="urn__pt">A Urna Espiritual</p>
            <p className="urn__aka label">O artefato que fala enquanto é carregado</p>
          </div>

          <p className="urn__tagline" data-reveal style={delay(1)}>
            Uma presença que não precisa de um rosto para ser ouvida.
          </p>

          <p className="urn__desc" data-reveal style={delay(2)}>
            A Urna Espiritual de Deadlock: presença, personalidade e a atmosfera sobrenatural do jogo, só por meio da
            voz.
          </p>

          <blockquote className="urn__quote" data-reveal style={delay(3)}>
            <p>“Eu faço questão de pegar a Urna, tanto pelas almas quanto pelas falas dela.”</p>
            <footer className="label">Kaike, na gravação de apresentação</footer>
          </blockquote>

        </div>

        <figure className="urn__art">
          <div className="urn__art-sticky">
            <div className="urn__art-wrap">
              <span className="urn__glow" aria-hidden="true" />
              <SpiritUrn />
              <div className="urn__souls" aria-hidden="true">
                <div className="urn__souls-spin">
                  {[0, 72, 144, 216, 288].map((a) => (
                    <i key={a} style={{ transform: `rotate(${a}deg)` }} />
                  ))}
                </div>
              </div>
            </div>
            <figcaption className="sr-only">A Urna Espiritual</figcaption>
          </div>
        </figure>

        <div className="urn__listen" data-reveal style={delay(3)}>
          <VoicePlayer
            id={PLAYER_ID}
            track={urnTrack}
            label="Registro Nº 002 · A Urna"
            variant="urn"
            chaptersLabel="Pule para uma situação"
          />
        </div>
      </div>
    </section>
  )
}
