import { useMemo } from 'react'
import { rng } from '../../lib/random'
import { Fog } from '../art/Fog'
import { StarField } from '../art/HeroArt'
import { SkylineLayer } from '../art/SkylineLayer'
import type { SkylineOptions } from '../art/skyline'
import { STAR4_PATH } from '../art/Star4'

/**
 * Nova York ao entardecer, vista de um telhado — o cenário da tela de título.
 * Camadas separadas para a câmera flutuar com paralaxe e "mergulhar" na saída.
 */

const FAR: SkylineOptions = {
  seed: 1931,
  width: 1600,
  height: 640,
  minH: 130,
  maxH: 290,
  minW: 30,
  maxW: 78,
  // mais alto no centro, onde fica o brilho do horizonte
  profile: (t) => 0.55 + 0.75 * Math.exp(-(((t - 0.5) / 0.2) ** 2)),
  landmarks: [
    { x: 470, w: 96, h: 400, type: 'deco' },
    { x: 1128, w: 92, h: 380, type: 'deco' },
    { x: 642, w: 70, h: 520, type: 'chrysler' },
    { x: 968, w: 60, h: 470, type: 'gothic' },
    { x: 800, w: 118, h: 630, type: 'empire' },
  ],
  windows: { density: 0.07, w: 3, h: 5, gx: 5, gy: 7, pink: 0.06 },
  detail: { setback: 0.5, water: 0.08, antenna: 0.3, gothic: 0.08, dome: 0.06, cornice: 0.4 },
}

const MID: SkylineOptions = {
  seed: 77,
  width: 1600,
  height: 520,
  minH: 150,
  maxH: 400,
  minW: 50,
  maxW: 128,
  // vale no centro para as torres do fundo aparecerem atrás do logo
  profile: (t) => 0.42 + 1.15 * Math.abs(t - 0.5),
  windows: { density: 0.14, w: 4, h: 6, gx: 6, gy: 8, pink: 0.1 },
  detail: { setback: 0.35, water: 0.35, antenna: 0.12, gothic: 0.05, cornice: 0.7 },
}

type Win = { x: number; y: number; w: number; h: number; lit: number; twinkle: boolean }

/** Grade de janelas em arco de uma fachada próxima. */
function facade(seed: number, x0: number, cols: number, colStep: number, rows: number) {
  const r = rng(seed)
  const wins: Win[] = []
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      // andares inteiros às vezes acesos, como um escritório trabalhando à noite
      const roll = r.next()
      const lit = roll < 0.3 ? r.range(0.3, 0.95) : 0
      wins.push({
        x: x0 + c * colStep,
        y: 30 + row * 50,
        w: 18,
        h: 32,
        lit,
        twinkle: lit > 0 && r.chance(0.07),
      })
    }
  }
  return wins
}

const arched = (w: Win) =>
  `M${w.x} ${w.y + w.h}V${w.y + w.w / 2}A${w.w / 2} ${w.w / 2} 0 0 1 ${w.x + w.w} ${w.y + w.w / 2}V${w.y + w.h}Z`

/** Prédios enormes nas laterais, como se a câmera estivesse entre eles. */
function NearFrame() {
  const left = useMemo(() => facade(12, 14, 11, 32, 18), [])
  const right = useMemo(() => facade(34, 1252, 11, 32, 18), [])
  return (
    <svg className="tc__near-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="tc-near-l" x1="0" x2="1">
          <stop offset="0" stopColor="var(--near-face)" />
          <stop offset="1" stopColor="var(--near-edge)" />
        </linearGradient>
        <linearGradient id="tc-near-r" x1="1" x2="0">
          <stop offset="0" stopColor="var(--near-face)" />
          <stop offset="1" stopColor="var(--near-edge)" />
        </linearGradient>
      </defs>

      {/* prédio da esquerda: fachada + face lateral em perspectiva */}
      <path d="M-40 -60H372V900H-40Z" fill="url(#tc-near-l)" />
      <path d="M372 -60L436 -20V870L372 900Z" fill="var(--near-side)" />
      {[0, 4, 8, 12, 16].map((k) => (
        <rect key={k} x="-40" y={20 + k * 50} width="412" height="6" fill="var(--near-edge)" />
      ))}
      {/* prédio da direita */}
      <path d="M1238 -60H1640V900H1238Z" fill="url(#tc-near-r)" />
      <path d="M1238 -60L1174 -20V870L1238 900Z" fill="var(--near-side)" />
      {[0, 4, 8, 12, 16].map((k) => (
        <rect key={k} x="1238" y={20 + k * 50} width="402" height="6" fill="var(--near-edge)" />
      ))}

      {[...left, ...right].map((w, i) => (
        <path
          key={i}
          d={arched(w)}
          fill={w.lit ? 'var(--window-warm)' : 'var(--near-glass)'}
          opacity={w.lit ? w.lit : 1}
          className={w.twinkle ? 'tc__twinkle' : undefined}
          style={w.twinkle ? { animationDelay: `${(i % 7) * 1.7}s` } : undefined}
        />
      ))}

      {/* letreiro de neon com a estrela da Celeste */}
      <g className="tc__neon">
        <rect x="1180" y="300" width="44" height="190" rx="4" fill="#120b16" stroke="#3a2840" strokeWidth="2" />
        <path d="M1224 330H1240M1224 460H1240" stroke="#3a2840" strokeWidth="4" />
        <g transform="translate(1202 395) scale(1.5) translate(-12 -12)">
          <path d={STAR4_PATH} fill="none" stroke="var(--celeste-pink)" strokeWidth="5" opacity="0.45" />
          <path d={STAR4_PATH} fill="none" stroke="#ffe6fb" strokeWidth="1.2" />
        </g>
        {[322, 346, 444, 468].map((y) => (
          <circle key={y} cx="1202" cy={y} r="3" fill="#ffd7f3" className="tc__neon-dot" />
        ))}
      </g>
    </svg>
  )
}

/** Parapeito do telhado em primeiro plano, caixa d'água e algumas almas soltas. */
function Ledge() {
  return (
    <svg className="tc__ledge-svg" viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
      <defs>
      </defs>
      <g fill="var(--ledge)">
        <path d="M-20 150H1620V220H-20Z" />
        <path d="M-20 138H1620V152H-20Z" fill="var(--ledge-top)" />
        {/* casinha da escada no telhado */}
        <path d="M120 150V70H270V150Z" />
        <path d="M110 70H280V58H110Z" fill="var(--ledge-top)" />
        <rect x="176" y="92" width="34" height="58" fill="#1f1520" />
        <rect x="182" y="98" width="22" height="16" fill="var(--window-warm)" opacity="0.7" />
        {/* caixa d'água */}
        <path d="M1384 150V96h6v54zM1462 150V96h6v54z" />
        <path d="M1376 96V30h100v66z" />
        <path d="M1368 30L1426 -6L1484 30Z" />
        <path d="M1376 52h100M1376 74h100" stroke="var(--ledge-top)" strokeWidth="2" />
        {/* respiros */}
        <path d="M620 150v-26h18v26zM612 124h34v-8h-34z" />
        <path d="M980 150v-18h40v18z" />
      </g>
    </svg>
  )
}

/** Almas sobre o telhado: elementos próprios, flutuam só com transform/opacity. */
const SOULS = [
  { left: '33.5%', bottom: '44%', width: 'calc(3.2 * var(--vmin))', animationDelay: '0s' },
  { left: '36.4%', bottom: '58%', width: 'calc(2.3 * var(--vmin))', animationDelay: '-1.6s' },
  { left: '31.8%', bottom: '64%', width: 'calc(1.7 * var(--vmin))', animationDelay: '-3.2s' },
  { left: '73.6%', bottom: '40%', width: 'calc(2.1 * var(--vmin))', animationDelay: '-4.8s' },
]

export function TitleCity() {
  return (
    <div className="tc" aria-hidden="true">
      <div className="tc__sky" />
      <StarField className="tc__stars" seed={5} count={120} sparkles={5} />
      <Fog className="tc__clouds-hi" variant="b" speed={220} color="#1c1230" strength={0.9} />
      <div className="tc__rays" />
      <div className="tc__glow" />

      <div className="tc__layer tc__far">
        <SkylineLayer options={FAR} fill="var(--city-far)" windows={0.55} blinking={2} />
      </div>
      <div className="tc__haze" />
      <Fog className="tc__clouds-low" variant="a" speed={180} color="#f2a493" strength={0.16} />

      <div className="tc__layer tc__mid">
        <SkylineLayer options={MID} fill="var(--city-mid)" windows={1} blinking={1} />
      </div>
      <Fog className="tc__fog" variant="b" speed={120} reverse color="#c79ad0" strength={0.22} />

      <div className="tc__layer tc__near">
        <NearFrame />
      </div>
      <div className="tc__layer tc__ledge">
        <Ledge />
        {SOULS.map((st, i) => (
          <span key={i} className="tc__soul" style={st} />
        ))}
      </div>
      <div className="tc__vignette" />
    </div>
  )
}
