/**
 * Fitas de energia espectral que varrem a tela (na abertura e ao começar).
 * Cada fita é um traço curto que percorre a curva (stroke-dashoffset), com
 * uma cópia desfocada por baixo fazendo o brilho. Remonte (key) para repetir.
 */
const PATHS = [
  'M-120 700C260 520 520 840 820 610S1320 360 1740 520',
  'M-120 250C240 430 560 120 860 300S1380 560 1740 240',
  'M180 1020C380 700 300 420 640 270S1080 60 1300 -100',
  'M1740 840C1420 760 1200 520 980 560S520 760 240 1020',
  'M-120 470C300 300 640 560 980 420S1480 160 1740 330',
]

export function Ribbons({ intense = false, delay = 0 }: { intense?: boolean; delay?: number }) {
  return (
    <svg
      className={`ribbons${intense ? ' ribbons--intense' : ''}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#5ff2c4" />
          <stop offset="0.55" stopColor="var(--spirit)" />
          <stop offset="1" stopColor="#e9b8f0" />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <g key={i} className="ribbon">
          <path d={d} pathLength={1000} className="ribbon__glow" style={{ animationDelay: `${delay + i * 0.16}s` }} />
          <path d={d} pathLength={1000} className="ribbon__core" style={{ animationDelay: `${delay + i * 0.16}s` }} />
          <path d={d} pathLength={1000} className="ribbon__trail" style={{ animationDelay: `${delay + i * 0.16 + 0.12}s` }} />
        </g>
      ))}
    </svg>
  )
}
