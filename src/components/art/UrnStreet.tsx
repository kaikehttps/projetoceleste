import { useMemo } from 'react'
import { rng } from '../../lib/random'

/**
 * Rua de Nova York sumindo na escuridão, desenhada com projeção em
 * perspectiva de verdade: cada ponto (X, Y) do plano da frente é levado
 * em direção ao ponto de fuga conforme a profundidade z.
 */

const VP = { x: 800, y: 470 }
const proj = (X: number, Y: number, z: number) => [VP.x + (X - VP.x) / z, VP.y + (Y - VP.y) / z] as const
const pt = (X: number, Y: number, z: number) => proj(X, Y, z).map((n) => n.toFixed(1)).join(' ')

/** Quadrilátero na parede lateral (plano X fixo) entre profundidades z0–z1 e alturas Y0–Y1. */
const wallQuad = (X: number, z0: number, z1: number, Ytop: number, Ybot: number) =>
  `M${pt(X, Ybot, z0)}L${pt(X, Ytop, z0)}L${pt(X, Ytop, z1)}L${pt(X, Ybot, z1)}Z`

type Facade = { side: -1 | 1; z0: number; z1: number; top: number; tone: number }

function useStreet() {
  return useMemo(() => {
    const r = rng(404)
    const facades: Facade[] = []
    const warm: string[] = []
    const ghost: string[] = []
    const pink: string[] = []
    for (const side of [-1, 1] as const) {
      let z = 1
      while (z < 14) {
        const len = r.range(0.35, 0.9) * z
        const top = r.range(-520, 60)
        facades.push({ side, z0: z, z1: z + len, top, tone: r.range(0, 1) })
        // janelas: colunas ao longo da profundidade, linhas na altura
        const X = side < 0 ? 0 : 1600
        const cols = Math.max(1, Math.round(len / (0.12 * z)))
        for (let c = 0; c < cols; c++) {
          const za = z + (len * (c + 0.2)) / cols
          const zb = z + (len * (c + 0.75)) / cols
          for (let Y = 820; Y > top + 60; Y -= 120) {
            if (!r.chance(0.11)) continue
            const quad = wallQuad(X, za, zb, Y - 70, Y)
            const roll = r.next()
            if (roll < 0.14) ghost.push(quad)
            else if (roll < 0.24) pink.push(quad)
            else warm.push(quad)
          }
        }
        z += len + r.range(0.02, 0.08) * z
      }
    }
    return { facades, warm: warm.join(''), ghost: ghost.join(''), pink: pink.join('') }
  }, [])
}

const LAMPS = [1.25, 1.9, 2.9, 4.4, 6.8, 10.5]

export function UrnStreet({ className = '' }: { className?: string }) {
  const { facades, warm, ghost, pink } = useStreet()

  // linhas do calçamento: transversais mais juntas ao fundo, longitudinais convergindo
  const cross = Array.from({ length: 26 }, (_, i) => 1 + i * i * 0.05)
  const lanes = [300, 520, 700, 800, 900, 1080, 1300]

  return (
    <svg className={className} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="us-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="0.5" stopColor="var(--sky-mid)" />
          <stop offset="1" stopColor="var(--sky-low)" />
        </linearGradient>
        <radialGradient id="us-vp" cx="50%" cy="47%" r="30%">
          <stop offset="0" stopColor="var(--spirit)" stopOpacity="0.36" />
          <stop offset="0.35" stopColor="var(--haze)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--haze)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="us-lamp">
          <stop offset="0" stopColor="var(--celeste-lilac)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--celeste-lilac)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="us-ground" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--street)" />
          <stop offset="1" stopColor="var(--stone)" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="url(#us-sky)" />
      <rect width="1600" height="1000" fill="url(#us-vp)" className="us__vp" />

      {/* chão da rua */}
      <path d={`M${pt(-200, 1000, 1)}L${pt(1800, 1000, 1)}L${pt(1800, 1000, 60)}L${pt(-200, 1000, 60)}Z`} fill="url(#us-ground)" />
      <g stroke="var(--stone-2)" strokeOpacity="0.1" strokeWidth="1" fill="none">
        {cross.map((z) => (
          <path key={z} d={`M${pt(140, 1000, z)}L${pt(1460, 1000, z)}`} />
        ))}
        {lanes.map((X) => (
          <path key={X} d={`M${pt(X, 1000, 1)}L${pt(X, 1000, 40)}`} />
        ))}
      </g>
      {/* meio-fio */}
      <g stroke="var(--stone-2)" strokeOpacity="0.5" strokeWidth="3" fill="none">
        <path d={`M${pt(140, 1000, 1)}L${pt(140, 1000, 40)}`} />
        <path d={`M${pt(1460, 1000, 1)}L${pt(1460, 1000, 40)}`} />
      </g>

      {/* fachadas, das mais distantes para as mais próximas */}
      {[...facades]
        .sort((a, b) => b.z0 - a.z0)
        .map((f, i) => {
          const X = f.side < 0 ? 0 : 1600
          const face = f.tone > 0.5 ? 'var(--city-mid)' : 'var(--city-far-2)'
          return (
            <g key={i}>
              <path d={wallQuad(X, f.z0, f.z1, f.top, 1000)} fill={face} />
              {/* cornija e divisa entre prédios */}
              <path
                d={`M${pt(X, f.top, f.z0)}L${pt(X, f.top, f.z1)}M${pt(X, f.top, f.z0)}L${pt(X, 1000, f.z0)}`}
                stroke="var(--city-near)"
                strokeWidth={6 / f.z0 + 1}
                fill="none"
              />
            </g>
          )
        })}

      <g style={{ opacity: 'var(--window-strength)' }}>
        <path d={warm} fill="var(--window-warm)" opacity="0.32" />
        <path d={pink} fill="var(--window-pink)" opacity="0.5" />
        <path d={ghost} fill="var(--spirit)" opacity="0.55" className="us__ghost" />
      </g>

      {/* postes recuando até o ponto de fuga */}
      {LAMPS.flatMap((z) =>
        [180, 1420].map((X) => {
          const [bx, by] = proj(X, 1000, z)
          const [tx, ty] = proj(X, 440, z)
          const w = 9 / z
          return (
            <g key={`${X}-${z}`}>
              <circle cx={tx} cy={ty} r={150 / z} fill="url(#us-lamp)" />
              <rect x={bx - w / 2} y={ty} width={w} height={by - ty} fill="var(--city-near)" />
              <circle cx={tx} cy={ty} r={7 / z} fill="var(--celeste-lilac)" />
            </g>
          )
        }),
      )}
    </svg>
  )
}
