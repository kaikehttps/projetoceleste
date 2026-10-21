import { Header } from './components/Header'
import { Marquee } from './components/Marquee'
import { NowPlaying } from './components/player/NowPlaying'
import { useScenes } from './lib/useScenes'
import { About } from './sections/About'
import { Finale } from './sections/Finale'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Shopkeeper } from './sections/Shopkeeper'
import { SoulUrn } from './sections/SoulUrn'

const MARQUEE = [
  'Registro de voz Nº 001',
  'O Vendedor',
  'Registro de voz Nº 002',
  'A Urna Espiritual',
  'Fã dublagem em PT-BR',
  'Nova York nunca dorme',
]

export function App() {
  useScenes()
  return (
    <>
      <a className="skip-link" href="#vendedor">
        Pular para as demonstrações
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <div id="demonstracoes">
          <Marquee items={MARQUEE} />
          <Shopkeeper />
          <SoulUrn />
        </div>
        <Finale />
      </main>
      <Footer />
      <NowPlaying />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
