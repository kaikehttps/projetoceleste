import { useRef } from 'react'
import { Fog } from '../components/art/Fog'
import { Storefront } from '../components/art/Storefront'
import { VoicePlayer } from '../components/player/VoicePlayer'
import { useSceneLevel } from '../audio/hooks'
import { shopkeeperTrack } from '../data/recordings'
import { delay } from '../lib/style'
import './Shopkeeper.css'

const PLAYER_ID = 'vendedor'

export function Shopkeeper() {
  const ref = useRef<HTMLElement>(null)
  useSceneLevel(ref, [PLAYER_ID])

  return (
    <section className="shop scene" id="vendedor" ref={ref} aria-labelledby="shop-title">
      <div className="shop__backdrop" aria-hidden="true">
        <Fog className="shop__fog" variant="b" speed={150} />
      </div>

      <header className="container shop__head">
        <div className="label-row shop__eyebrow" data-reveal>
          <span className="label">Registro de voz Nº 001</span>
          <span className="rule" />
          <span className="label">Personagem</span>
        </div>
        <h2 className="shop__title" id="shop-title">
          <span className="shop__the" data-reveal style={delay(1)}>
            The
          </span>
          <span className="shop__name" data-reveal="rise" style={delay(2)}>
            Shopkeeper
          </span>
        </h2>
      </header>

      <div className="container shop__grid">
        <figure className="shop__art" data-reveal="fade" style={delay(2)}>
          <Storefront />
          <figcaption className="art-credit">Ilustração original · não é arte oficial do jogo</figcaption>
        </figure>

        <div className="shop__content">
          <div className="shop__names" data-reveal>
            <p className="shop__pt">O Vendedor</p>
            <p className="shop__aka label">Também chamado de Curiosity Dealer</p>
          </div>

          <p className="shop__tagline" data-reveal style={delay(1)}>
            Todo negócio tem uma história. Algumas é melhor não conhecer.
          </p>

          <p className="shop__desc" data-reveal style={delay(2)}>
            Uma interpretação experimental em português brasileiro do Vendedor de Deadlock, buscando explorar sua
            personalidade, seu humor e a maneira como ele se dirige aos diferentes personagens.
          </p>

          <div data-reveal style={delay(3)}>
            <VoicePlayer
              id={PLAYER_ID}
              track={shopkeeperTrack}
              label="Registro Nº 001 · O Vendedor"
              variant="shop"
              chaptersLabel="Pule para uma interação"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
