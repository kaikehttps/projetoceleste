import { useMemo } from 'react'
import { rng } from '../../lib/random'
import { STAR4_PATH } from './Star4'

/** Céu estrelado com alguns brilhos de quatro pontas, como na logo. */
export function StarField({ seed = 7, count = 130, sparkles = 9, className = '' }) {
  const { stars, glints } = useMemo(() => {
    const r = rng(seed)
    const stars = Array.from({ length: count }, () => ({
      x: r.range(0, 1600),
      y: r.range(0, 620) ** 1.08 / 1.3,
      s: r.chance(0.1) ? r.range(1.2, 1.9) : r.range(0.45, 1.05),
      o: r.range(0.25, 0.95),
    }))
    const glints = Array.from({ length: sparkles }, (_, i) => ({
      x: r.range(40, 1560),
      y: r.range(30, 380),
      s: r.range(0.5, 1.15),
      twinkle: i % 3 === 0,
    }))
    return { stars, glints }
  }, [seed, count, sparkles])

  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <g fill="var(--star)">
        {stars.map((st, i) => (
          <circle key={i} cx={st.x.toFixed(1)} cy={st.y.toFixed(1)} r={st.s.toFixed(2)} opacity={st.o.toFixed(2)} />
        ))}
      </g>
      <g fill="var(--celeste-lilac)">
        {glints.map((g, i) => (
          <path
            key={i}
            className={g.twinkle ? 'twinkle' : undefined}
            d={STAR4_PATH}
            transform={`translate(${g.x.toFixed(0)} ${g.y.toFixed(0)}) scale(${g.s.toFixed(2)}) translate(-12 -12)`}
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * A lua é a pupila de um olho que vigia a cidade: anéis, mira e pálpebras
 * desenhados quase no limite da percepção — o sobrenatural escondido no céu.
 */
export function WatchingMoon({ className = '' }) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg className={className} viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--moon)" stopOpacity="0.38" />
          <stop offset="0.22" stopColor="var(--haze)" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="var(--haze)" stopOpacity="0.04" />
          <stop offset="1" stopColor="var(--haze)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon-face" cx="40%" cy="36%" r="70%">
          <stop offset="0" stopColor="var(--moon)" />
          <stop offset="0.7" stopColor="var(--moon)" stopOpacity="0.92" />
          <stop offset="1" stopColor="var(--celeste-lilac)" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="300" fill="url(#moon-halo)" />
      <g className="moon__eye" fill="none" stroke="var(--star)">
        <circle cx="300" cy="300" r="262" strokeOpacity="0.07" />
        <circle cx="300" cy="300" r="196" strokeOpacity="0.1" strokeDasharray="1.5 7" />
        <path d="M28 300Q300 70 572 300Q300 530 28 300Z" strokeOpacity="0.15" strokeWidth="1.2" />
        <path d="M70 300Q300 128 530 300Q300 472 70 300Z" strokeOpacity="0.07" />
      </g>
      <g className="moon__spokes" stroke="var(--star)" strokeOpacity="0.09">
        {spokes.map((a) => (
          <line key={a} x1="300" y1="186" x2="300" y2="42" transform={`rotate(${a} 300 300)`} />
        ))}
      </g>
      <circle cx="300" cy="300" r="84" fill="url(#moon-face)" />
      <g fill="var(--celeste-lilac)" opacity="0.16">
        <circle cx="272" cy="282" r="13" />
        <circle cx="322" cy="318" r="9" />
        <circle cx="318" cy="268" r="5" />
        <circle cx="280" cy="330" r="6" />
      </g>
      <path
        d={STAR4_PATH}
        fill="var(--celeste-lilac)"
        transform="translate(372 222) scale(1.5) translate(-12 -12)"
        className="moon__glint"
      />
    </svg>
  )
}

/** Primeiro plano: trem elevado, postes, escada de incêndio e caixa d'água. */
export function NearStreet({ className = '' }) {
  const columns = [40, 260, 480, 700, 920, 1140, 1360, 1580]
  const truss = Array.from({ length: 41 }, (_, i) => i * 40)
  const cars = [990, 1166, 1342, 1518]
  return (
    <svg className={className} viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="lamp-glow">
          <stop offset="0" stopColor="var(--window-warm)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--window-warm)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="var(--city-near)">
        {/* trem elevado */}
        {cars.map((x) => (
          <path key={x} d={`M${x} 194V160Q${x} 150 ${x + 12} 150H${x + 158}Q${x + 170} 150 ${x + 170} 160V194Z`} />
        ))}
        <rect x="-10" y="192" width="1620" height="6" />
        <rect x="-10" y="198" width="1620" height="16" opacity="0.92" />
        <rect x="-10" y="214" width="1620" height="8" />
        {columns.map((x) => (
          <path key={x} d={`M${x - 8} 222h16v84l8 14h-32l8-14z`} />
        ))}
      </g>
      <g stroke="var(--city-near)" strokeWidth="2.5" fill="none">
        {truss.map((x) => (
          <path key={x} d={`M${x} 222L${x + 20} 246L${x + 40} 222`} />
        ))}
        <path d="M-10 246H1610" />
      </g>
      <g fill="var(--window-warm)" style={{ opacity: 'var(--window-strength)' }}>
        {cars.flatMap((x) =>
          [0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={`${x}-${k}`} x={x + 16 + k * 25} y="161" width="12" height="10" rx="1.5" opacity={k === 2 ? 0.2 : 0.5} />
          )),
        )}
      </g>

      {/* prédio da esquerda com escada de incêndio */}
      <g fill="var(--city-near)">
        <path d="M-20 320V28H120V20H132V28H168V320Z" />
        <g stroke="var(--city-near)" strokeWidth="3">
          {[70, 130, 190, 250].map((y) => (
            <g key={y}>
              <path d={`M168 ${y}H226`} />
              <path d={`M226 ${y}V${y - 16}M168 ${y - 16}H226`} strokeWidth="1.6" />
              <path d={`M176 ${y}L218 ${y + 56}`} strokeWidth="2" />
            </g>
          ))}
        </g>
      </g>
      <g fill="var(--window-warm)" style={{ opacity: 'var(--window-strength)' }}>
        <rect x="24" y="66" width="12" height="16" opacity="0.7" />
        <rect x="86" y="154" width="12" height="16" opacity="0.5" />
        <rect x="56" y="242" width="12" height="16" opacity="0.8" />
      </g>

      {/* prédio da direita com caixa d'água */}
      <g fill="var(--city-near)">
        <path d="M1452 320V112H1620V320Z" />
        <path d="M1446 112h180v-6h-180z" />
        <rect x="1504" y="76" width="4" height="30" />
        <rect x="1546" y="76" width="4" height="30" />
        <rect x="1494" y="40" width="64" height="38" rx="2" />
        <path d="M1488 40L1526 16L1564 40Z" />
      </g>
      <rect x="1478" y="150" width="12" height="16" fill="var(--window-pink)" opacity="0.6" />

      {/* postes */}
      {[430, 760, 1220].map((x) => (
        <g key={x}>
          <circle cx={x + 22} cy="128" r="46" fill="url(#lamp-glow)" className="lamp-glow" />
          <path
            fill="var(--city-near)"
            d={`M${x - 3} 320V126h6v194zM${x} 126q0-10 14-10h8v4h-6q-10 0-10 6z`}
          />
          <path fill="var(--city-near)" d={`M${x + 14} 120h16l-3 10h-10z`} />
          <circle cx={x + 22} cy="131" r="3" fill="var(--window-warm)" />
        </g>
      ))}
    </svg>
  )
}
