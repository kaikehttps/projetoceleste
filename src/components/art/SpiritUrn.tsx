import { useMemo } from 'react'
import urnImage from '../../assets/art/soul-urn.webp'
import { rng } from '../../lib/random'

/**
 * A Urna flutuando no meio de anéis arcanos. A imagem da urna foi enviada
 * pelo Kaike; aura, anéis, símbolos, poeira e almas são desenhados aqui.
 * O brilho reage a --level e as almas orbitam com [data-playing] na seção.
 */

const URN = { w: 266, h: 342 }
const URN_X = 200 - URN.w / 2
const URN_Y = 318 - URN.h / 2

const GLYPHS = [
  { x: 44, y: 198, d: 'M0-10A10 10 0 1 1 0 10A10 10 0 1 1 0-10M-14 0H14' },
  { x: 356, y: 232, d: 'M-9 8L0-10L9 8ZM0-2V4' },
  { x: 30, y: 420, d: 'M-10 0H10M0-10V10M-7-7L7 7' },
  { x: 372, y: 448, d: 'M0-11L9 0L0 11L-9 0ZM0-4V4' },
  { x: 330, y: 122, d: 'M-8-8H8V8H-8ZM-8-8L8 8' },
  { x: 78, y: 96, d: 'M0-10V10M-8-4L0-10L8-4' },
]

export function SpiritUrn({ className = '' }: { className?: string }) {
  const dust = useMemo(() => {
    const r = rng(9)
    return Array.from({ length: 18 }, () => ({
      x: r.range(10, 390),
      y: r.range(40, 560),
      s: r.range(0.8, 2.2),
      d: r.range(0, 8),
    }))
  }, [])

  return (
    <svg
      className={`urn-art ${className}`}
      viewBox="0 0 400 600"
      role="img"
      aria-label="A Urna Espiritual flutuando, cercada por anéis de símbolos arcanos e uma luz sobrenatural."
    >
      <defs>
        <radialGradient id="urn-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--spirit)" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="var(--spirit)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--spirit)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="urn-aura" cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="var(--celeste-pink)" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="var(--celeste-pink)" stopOpacity="0.08" />
          <stop offset="1" stopColor="var(--celeste-pink)" stopOpacity="0" />
        </radialGradient>
        <filter id="urn-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* aura e sombra no chão */}
      <circle cx="200" cy="318" r="200" fill="url(#urn-aura)" className="urn-art__aura" />
      <ellipse cx="200" cy="556" rx="104" ry="12" fill="#000" opacity="0.4" className="urn-art__shadow" />

      {/* anel arcano (metade de trás) */}
      <g className="urn-art__ring" fill="none" stroke="var(--celeste-lilac)">
        <path d="M24 330A176 40 0 0 1 376 330" strokeOpacity="0.35" strokeDasharray="2 9" />
        <path d="M54 290A146 30 0 0 1 346 290" strokeOpacity="0.2" />
      </g>

      <g className="urn-art__float">
        <circle cx="200" cy="318" r="150" fill="url(#urn-core)" className="urn-art__core" />
        <image
          href={urnImage}
          x={URN_X}
          y={URN_Y}
          width={URN.w}
          height={URN.h}
          className="urn-art__image"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* anel arcano (metade da frente) e símbolos */}
      <g className="urn-art__ring" fill="none" stroke="var(--celeste-lilac)">
        <path d="M24 330A176 40 0 0 0 376 330" strokeOpacity="0.6" strokeDasharray="2 9" className="urn-art__ring-flow" />
        <path d="M54 290A146 30 0 0 0 346 290" strokeOpacity="0.3" />
      </g>
      <g className="urn-art__glyphs" fill="none" stroke="var(--celeste-lilac)" strokeWidth="1.4" strokeOpacity="0.7">
        {GLYPHS.map((g, i) => (
          <g key={i} transform={`translate(${g.x} ${g.y})`}>
            <path d={g.d} style={{ animationDelay: `${i * -1.3}s` }} />
          </g>
        ))}
      </g>

      {/* almas em órbita: só aparecem enquanto a Urna fala */}
      <g className="urn-art__souls" transform="translate(200 330) scale(1 0.24)">
        <g className="urn-art__souls-spin">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} r="7" cx="176" cy="0" transform={`rotate(${a})`} fill="var(--spirit)" filter="url(#urn-glow)" />
          ))}
        </g>
      </g>

      {/* poeira suspensa */}
      <g fill="var(--star)" className="urn-art__dust">
        {dust.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.s} opacity="0.5" style={{ animationDelay: `${-p.d}s` }} />
        ))}
      </g>
    </svg>
  )
}
