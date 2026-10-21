import { useMemo } from 'react'
import { buildSkyline, type SkylineOptions } from './skyline'

type Props = {
  options: SkylineOptions
  className?: string
  /** Variável CSS da cor dos prédios, ex.: 'var(--city-mid)'. */
  fill: string
  /** Quantas luzes de aviso piscam no topo dos arranha-céus mais altos. */
  blinking?: number
  /** Opacidade das janelas acesas. */
  windows?: number
  align?: 'xMidYMax' | 'xMinYMax' | 'xMaxYMax'
}

export function SkylineLayer({ options, className = '', fill, blinking = 0, windows = 1, align = 'xMidYMax' }: Props) {
  const s = useMemo(() => buildSkyline(options), [options])
  const beacons = useMemo(
    () => [...s.beacons].sort((a, b) => a.y - b.y).slice(0, blinking),
    [s.beacons, blinking],
  )
  return (
    <svg
      className={`skyline ${className}`}
      viewBox={`0 0 ${options.width} ${options.height}`}
      preserveAspectRatio={`${align} slice`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={s.body} fill={fill} />
      {windows > 0 && (
        <g style={{ opacity: `calc(${windows} * var(--window-strength))` }}>
          <path d={s.warm} fill="var(--window-warm)" opacity="0.75" />
          <path d={s.pink} fill="var(--window-pink)" opacity="0.8" />
        </g>
      )}
      {beacons.map((b, i) => (
        <circle
          key={i}
          className="skyline__beacon"
          cx={b.x}
          cy={b.y - 2}
          r="2.4"
          style={{ animationDelay: `${i * 1.3}s` }}
        />
      ))}
    </svg>
  )
}
