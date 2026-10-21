import wordmark from '../assets/brand/celeste-wordmark.webp'
import wordmarkInk from '../assets/brand/celeste-wordmark-ink.webp'
import lockup from '../assets/brand/celeste-lockup-full.webp'
import lockupInk from '../assets/brand/celeste-lockup-full-ink.webp'
import deadlockLockup from '../assets/brand/deadlock-lockup.webp'
import './Logo.css'

/*
 * Logo do Projeto Celeste, extraída do arquivo original sem redesenho
 * (scripts/extract-logo.py). A versão "ink" é a mesma forma em tinta escura,
 * usada no tema claro. Proporções sempre preservadas (height: auto).
 */

type Props = { className?: string; eager?: boolean }

function Themed({ light, ink, alt, w, h, className = '', eager }: Props & { light: string; ink: string; alt: string; w: number; h: number }) {
  return (
    <span className={`logo ${className}`}>
      <img className="logo__on-dark" src={light} alt={alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <img className="logo__on-light" src={ink} alt={alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </span>
  )
}

export function CelesteLogo(props: Props) {
  return <Themed {...props} light={wordmark} ink={wordmarkInk} alt="Celeste" w={928} h={480} eager />
}

export function CelesteLockup(props: Props) {
  return (
    <Themed
      {...props}
      light={lockup}
      ink={lockupInk}
      alt="Projeto Celeste — Deadlock Fã Dublado em PT-BR"
      w={1634}
      h={480}
    />
  )
}

/** Olho + DEADLOCK + FÃ DUBLADO EM PT-BR, do banner do Projeto Celeste. Só existe a versão branca: aparece sempre sobre o escuro. */
export function DeadlockLockup({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <img src={deadlockLockup} alt="Deadlock — Fã dublado em PT-BR" width={658} height={384} decoding="async" />
    </span>
  )
}
