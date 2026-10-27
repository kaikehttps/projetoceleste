import { ArrowUp, Music2 } from 'lucide-react'
import { useMusic } from '../audio/music'
import { CelesteLockup } from '../components/Logo'
import { Star4 } from '../components/art/Star4'
import { site } from '../config'
import './Footer.css'

export function Footer() {
  const { available } = useMusic()
  const m = site.music
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <CelesteLockup className="site-footer__logo" />

        <ul className="site-footer__meta">
          <li>Demonstração independente de fã dublagem.</li>
          <li>Site em português brasileiro.</li>
          <li>
            Portfólio de <strong>{site.author}</strong>.
          </li>
          {site.contacts.map((c) => (
            <li key={c.href}>
              <a href={c.href}>{c.label}</a>
            </li>
          ))}
        </ul>

        <a className="site-footer__top" href="#inicio">
          <ArrowUp aria-hidden="true" />
          Voltar ao início
        </a>
      </div>

      {available && (
        <div className="container">
          <div className="site-footer__music">
            <p className="label">
              <Music2 aria-hidden="true" /> Música de fundo
            </p>
            <p>
              <strong>{m.title}</strong> <span className="site-footer__file">({m.file})</span> · {m.copyright}
            </p>
            <p>
              Trilha apresentada no vídeo do canal{' '}
              <a href={m.reference.url} target="_blank" rel="noreferrer">
                {m.reference.channel.name}
              </a>{' '}
              ·{' '}
              {m.reference.people.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && ' · '}
                  {p.role}:{' '}
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      <div className="container">
        <p className="site-footer__disclaimer">
          <Star4 />
          Este é um projeto independente de fã, sem vínculo oficial ou patrocínio da Valve ou do Projeto Celeste.
          Deadlock, seus personagens e demais propriedades intelectuais pertencem aos respectivos titulares. As
          ilustrações de cenário desta página são originais e não representam artes oficiais do jogo.
          {available && ' A música de fundo pertence à Valve Software.'}
        </p>

        {/* Nota discreta: só aparece para quem abrir. */}
        <details className="site-footer__note">
          <summary>Sobre as gravações</summary>
          <p>
            Esta página nasceu como um teste de fã dublagem. As gravações de voz feitas por {site.author} para esse
            teste foram retiradas e não fazem mais parte do site: os players do Vendedor e da Urna tocam as falas
            originais do próprio jogo (Deadlock, © Valve), e os players de apresentação e despedida ficam
            desativados, como arquivo encerrado.
          </p>
        </details>
      </div>
    </footer>
  )
}
