import { ArrowUp } from 'lucide-react'
import { CelesteLockup } from '../components/Logo'
import { Star4 } from '../components/art/Star4'
import { site } from '../config'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <CelesteLockup className="site-footer__logo" />

        <ul className="site-footer__meta">
          <li>Demonstração independente de fã dublagem.</li>
          <li>Vozes em português brasileiro.</li>
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

      <div className="container">
        <p className="site-footer__disclaimer">
          <Star4 />
          Este é um projeto independente de fã, sem vínculo oficial ou patrocínio da Valve ou do Projeto Celeste.
          Deadlock, seus personagens e demais propriedades intelectuais pertencem aos respectivos titulares. As
          ilustrações de cenário desta página são originais e não representam artes oficiais do jogo.
        </p>
      </div>
    </footer>
  )
}
