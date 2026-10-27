import { ArrowRight } from 'lucide-react'
import { Microphone } from '../components/art/Microphone'
import { Star4 } from '../components/art/Star4'
import { SealedPlayer } from '../components/player/SealedPlayer'
import { site } from '../config'
import { allTracks } from '../data/recordings'
import { delay } from '../lib/style'
import './About.css'

const totalSeconds = allTracks.reduce((s, t) => s + t.duration, 0)
const minutes = Math.floor(totalSeconds / 60)
const seconds = Math.round(totalSeconds % 60)

const FACTS = [
  { term: 'Formato', value: 'Fã dublagem independente' },
  { term: 'Idioma', value: 'Português brasileiro' },
  { term: 'Personagens', value: 'O Vendedor · A Urna Espiritual' },
  { term: 'Áudios', value: 'Falas do Vendedor e da Urna' },
  { term: 'Duração', value: `${minutes} min ${String(seconds).padStart(2, '0')} s de falas` },
  { term: 'Para', value: 'Projeto Celeste — Deadlock Fã Dublado em PT-BR' },
]

export function About() {
  return (
    <section className="about scene" id="projeto" aria-labelledby="about-title">
      <div className="container about__intro">
        <div className="label-row about__eyebrow" data-reveal>
          <span className="label label--accent">Capítulo I</span>
          <span className="rule" />
          <span className="label">O projeto</span>
        </div>

        <p className="about__lead" data-reveal style={delay(1)}>
          Uma demonstração de fã dublagem em português brasileiro com duas vozes de Deadlock que não são heróis,
          mas sempre <em>roubam a cena</em>.
        </p>

        <dl className="about__facts" data-reveal style={delay(2)}>
          {FACTS.map((f, i) => (
            <div key={f.term} className="about__fact">
              <dt className="label">
                <span className="about__fact-n">{String(i + 1).padStart(2, '0')}</span>
                {f.term}
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <article className="container dossier" id="sobre" aria-labelledby="about-title">
        <div className="dossier__stack" data-reveal>
          <div className="dossier__under" aria-hidden="true" />
          <div className="dossier__sheet">
            <span className="dossier__clip" aria-hidden="true" />

            <header className="dossier__top">
              <span className="label">Arquivo pessoal</span>
              <span className="label">Perfil de voz</span>
              <span className="label">Nova York · PT-BR</span>
            </header>

            <p className="dossier__stamp" aria-hidden="true">
              <span>Fã dublagem</span>
              <Star4 />
              <span>Independente</span>
            </p>

            <h2 className="dossier__title" id="about-title">
              Por trás <em>dessas vozes</em>
            </h2>

            <div className="dossier__cols">
              <div className="dossier__text">
                <p className="dossier__first">
                  Meu nome é <strong>{site.author}</strong>. Sou desenvolvedor front-end, apaixonado por tecnologia,
                  jogos e criação de experiências digitais. Comecei este projeto por gostar muito do universo de
                  Deadlock e por querer explorar a interpretação vocal de alguns de seus personagens.
                </p>
                <p>
                  Escolhi dois que não são heróis, mas sempre roubam a cena: <strong>a Urna</strong> e{' '}
                  <strong>o Vendedor</strong>. Têm falas engraçadas, muita personalidade e um jeito meio bobo que eu
                  adoro. Mais do que reproduzir falas, quero experimentar o ritmo e a presença de cada voz,
                  respeitando a essência do universo original.
                </p>
                <p>
                  Até aqui, dublei só por diversão, lendo mangá e jogando Ace Attorney com amigos no Discord. Nada
                  profissional, mas sempre foi algo que admirei muito. Tenho muita vontade de conhecer melhor o
                  trabalho do Projeto Celeste e, se surgir a oportunidade, contribuir com a equipe.
                </p>
              </div>

              <figure className="dossier__fig">
                <Microphone className="dossier__mic" />
                <figcaption className="label">Fig. 1 — Onde as vozes começam</figcaption>
              </figure>
            </div>

            <div className="dossier__audio">
              <div className="dossier__audio-head">
                <p className="label">Gravação de apresentação</p>
                <p className="dossier__audio-note">Esta gravação já foi retirada do ar.</p>
              </div>
              <SealedPlayer label="Introdução · Kaike" tone="paper" />
            </div>

            <footer className="dossier__sign">
              <span className="dossier__signature">{site.author}</span>
              <a className="dossier__next label" href="#vendedor">
                Próximo arquivo: Registro de voz Nº 001 <ArrowRight aria-hidden="true" />
              </a>
            </footer>
          </div>
        </div>
      </article>
    </section>
  )
}
