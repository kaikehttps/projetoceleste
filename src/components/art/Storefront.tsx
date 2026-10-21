import { STAR4_PATH } from './Star4'

/**
 * Fachada da loja do Vendedor — ilustração original (não é arte oficial).
 * A lâmpada e a luz interna reagem à variável CSS --level (voz tocando).
 */

const BOTTLES: { x: number; w: number; h: number; neck: number }[] = [
  { x: 196, w: 18, h: 44, neck: 14 },
  { x: 220, w: 24, h: 34, neck: 10 },
  { x: 252, w: 14, h: 52, neck: 18 },
  { x: 560, w: 20, h: 40, neck: 12 },
  { x: 588, w: 16, h: 30, neck: 10 },
]

const BOOKS = [
  [196, 34, 10],
  [208, 42, 12],
  [222, 30, 9],
  [233, 38, 11],
  [246, 26, 14],
] as const

/** Frasco de vidro com líquido; os líquidos brilham levemente. */
function Flask({ x, y, r, glow }: { x: number; y: number; r: number; glow: string }) {
  return (
    <g>
      <path
        d={`M${x - r * 0.3} ${y - r * 2.1}h${r * 0.6}v${r * 0.9}a${r} ${r} 0 1 1 ${-r * 0.6} 0z`}
        fill="#1b0f10"
        opacity="0.95"
      />
      <circle cx={x} cy={y - r * 0.2} r={r * 0.78} fill={glow} opacity="0.55" className="sf__potion" />
    </g>
  )
}

const AWNING_STEP = (872 - 128) / 12
const AWNING =
  'M128 290H872V318' +
  Array.from({ length: 12 }, (_, i) => {
    const x = 872 - i * AWNING_STEP
    return `Q${x - AWNING_STEP / 2} 352 ${x - AWNING_STEP} 318`
  }).join('') +
  'Z'

export function Storefront({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`sf ${className}`}
      viewBox="0 0 1000 1040"
      role="img"
      aria-label="Ilustração original: a fachada de uma loja antiga numa rua de Nova York à noite, com letreiro dourado, vitrine iluminada por uma lâmpada, prateleiras com frascos e armas penduradas, e a placa Aberto na porta."
    >
      <defs>
        <pattern id="sf-awning" width="64" height="80" patternUnits="userSpaceOnUse">
          <rect width="64" height="80" fill="var(--awning-a)" />
          <rect width="32" height="80" fill="var(--awning-b)" />
        </pattern>
        <linearGradient id="sf-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e2b4" />
          <stop offset="0.55" stopColor="var(--brass)" />
          <stop offset="1" stopColor="#8a6638" />
        </linearGradient>
        <radialGradient id="sf-interior" cx="50%" cy="18%" r="85%">
          <stop offset="0" stopColor="var(--shop-light)" stopOpacity="0.95" />
          <stop offset="0.32" stopColor="#9a5530" stopOpacity="0.85" />
          <stop offset="0.75" stopColor="#2a1514" />
          <stop offset="1" stopColor="#120a0b" />
        </radialGradient>
        <radialGradient id="sf-halo">
          <stop offset="0" stopColor="var(--shop-light)" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="var(--shop-light)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--shop-light)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sf-sidewalk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--street)" stopOpacity="0" />
          <stop offset="0.12" stopColor="var(--street)" />
          <stop offset="0.88" stopColor="var(--street)" />
          <stop offset="1" stopColor="var(--street)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sf-curb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--stone)" stopOpacity="0" />
          <stop offset="0.12" stopColor="var(--stone)" />
          <stop offset="0.88" stopColor="var(--stone)" />
          <stop offset="1" stopColor="var(--stone)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sf-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--shop-light)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--shop-light)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sf-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--shop-light)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--shop-light)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sf-window">
          <path d="M172 806V438Q172 336 402 336Q632 336 632 438V806Z" />
        </clipPath>
        <clipPath id="sf-door-glass">
          <path d="M708 640V408Q708 368 770 368Q832 368 832 408V640Z" />
        </clipPath>
      </defs>

      {/* fachada de madeira */}
      <rect x="112" y="150" width="776" height="800" fill="var(--wood)" />
      <rect x="96" y="132" width="808" height="26" fill="var(--wood-2)" />
      <path d="M96 158H904" stroke="var(--brass)" strokeWidth="1.5" opacity="0.6" />

      {/* letreiro */}
      <rect x="146" y="172" width="708" height="108" fill="#170d10" />
      <rect x="154" y="180" width="692" height="92" fill="none" stroke="var(--brass)" strokeWidth="2" opacity="0.85" />
      <rect x="162" y="188" width="676" height="76" fill="none" stroke="var(--brass)" strokeWidth="0.8" opacity="0.5" />
      <text x="500" y="212" textAnchor="middle" className="sf__sign-small">
        ARMAS · ITENS · CURIOSIDADES
      </text>
      <text x="500" y="257" textAnchor="middle" className="sf__sign" fill="url(#sf-gold)">
        O VENDEDOR
      </text>
      {[214, 786].map((x) => (
        <path key={x} d={STAR4_PATH} fill="url(#sf-gold)" transform={`translate(${x} 232) scale(1.1) translate(-12 -12)`} />
      ))}

      {/* toldo listrado com recortes */}
      <path d={AWNING} fill="url(#sf-awning)" />
      <path d="M116 290H884" stroke="#000" strokeOpacity="0.4" strokeWidth="4" />

      {/* ——— interior visto pela vitrine ——— */}
      <g clipPath="url(#sf-window)">
        <rect x="160" y="320" width="490" height="500" fill="url(#sf-interior)" />
        <rect x="160" y="320" width="490" height="500" fill="url(#sf-interior)" className="sf__surge" />

        {/* feixes de luz da lâmpada */}
        <path d="M392 412L250 806H330Z" fill="url(#sf-beam)" />
        <path d="M412 412L560 806H470Z" fill="url(#sf-beam)" />

        {/* rifle e revólver na parede */}
        <g fill="#170c0d">
          <path d="M232 396h190l14-6h52l6 8-6 8h-40l-10 10h-24l-6-10H232z" />
          <path d="M520 382h46l4 6h8v8h-10l-6 22h-12l2-16h-32z" />
          <rect x="226" y="404" width="6" height="16" rx="2" />
        </g>

        {/* prateleiras */}
        <g fill="#160b0c">
          <rect x="172" y="478" width="460" height="9" />
          <rect x="172" y="590" width="460" height="9" />
          <rect x="172" y="700" width="460" height="9" />
        </g>

        {/* prateleira de cima: garrafas, globo, ampulheta */}
        <g fill="#1b0f10">
          {BOTTLES.map((b) => (
            <path
              key={b.x}
              d={`M${b.x} 478v${-b.h + 6}q0-6 ${b.w / 2 - 3} -8v${-b.neck}h6v${b.neck}q${b.w / 2 - 3} 2 ${b.w / 2 - 3} 8v${b.h - 6}z`}
            />
          ))}
          <circle cx="330" cy="446" r="22" />
          <path d="M318 478l12-10 12 10zM307 446a23 23 0 0 1 46 0" fill="none" stroke="#1b0f10" strokeWidth="3" />
          <path d="M440 478h34v-4l-12-14 12-14v-4h-34v4l12 14-12 14z" />
          <rect x="492" y="446" width="44" height="32" rx="3" />
        </g>
        <path d="M454 448l3 10h1l3-10z" fill="var(--shop-light)" opacity="0.5" />

        {/* prateleira do meio: livros e frascos brilhando */}
        <g fill="#1b0f10">
          {BOOKS.map(([x, h, w]) => (
            <rect key={x} x={x} y={590 - h} width={w} height={h} />
          ))}
          <rect x="262" y="566" width="40" height="24" transform="rotate(-12 262 590)" />
          <rect x="500" y="550" width="60" height="40" rx="6" />
          <circle cx="516" cy="570" r="9" fill="#2b1817" />
          <path d="M530 562h22M530 570h22M530 578h22" stroke="#2b1817" strokeWidth="2" />
        </g>
        <Flask x={350} y={590} r={18} glow="var(--celeste-pink)" />
        <Flask x={396} y={590} r={13} glow="var(--spirit)" />
        <Flask x={440} y={590} r={16} glow="var(--celeste-lilac)" />

        {/* prateleira de baixo: caixas */}
        <g fill="#180d0e">
          <rect x="190" y="652" width="86" height="48" />
          <path d="M190 668h86M233 652v48" stroke="#2b1817" strokeWidth="2" />
          <rect x="286" y="668" width="58" height="32" />
          <rect x="560" y="660" width="60" height="40" />
        </g>

        {/* balcão */}
        <rect x="160" y="738" width="490" height="80" fill="var(--wood-2)" />
        <path d="M160 738H650" stroke="var(--brass)" strokeWidth="3" opacity="0.7" />
        <g fill="#140a0b">
          {/* caixa registradora */}
          <path d="M470 738l8-46h96l8 46z" />
          <rect x="490" y="664" width="74" height="28" rx="3" />
          <rect x="502" y="672" width="50" height="12" fill="var(--shop-light)" opacity="0.35" />
          {/* sineta */}
          <path d="M268 738a20 18 0 0 1 40 0z" />
          <rect x="284" y="714" width="8" height="6" rx="2" />
          <rect x="260" y="736" width="56" height="4" />
        </g>
        <g fill="#2a1817">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4].map((c) => <circle key={`${r}${c}`} cx={492 + c * 18} cy={704 + r * 8} r="2.4" />),
          )}
        </g>

        {/* lâmpada pendente */}
        <path d="M402 336V376" stroke="#140a0b" strokeWidth="2.5" />
        <circle cx="402" cy="414" r="130" fill="url(#sf-halo)" className="sf__halo" />
        <path d="M374 376h56l22 34H352z" fill="#140a0b" />
        <circle cx="402" cy="414" r="9" fill="#fff4dc" className="sf__bulb" />

        {/* reflexos no vidro */}
        <g fill="#fff" className="sf__glass">
          <path d="M170 560L330 336H372L170 620Z" opacity="0.045" />
          <path d="M520 806L640 640V700L570 806Z" opacity="0.05" />
        </g>
      </g>

      {/* letras douradas no vidro */}
      <defs>
        <path id="sf-arc" d="M228 452Q402 352 576 452" />
      </defs>
      <text className="sf__glass-text" fill="url(#sf-gold)">
        <textPath href="#sf-arc" startOffset="50%" textAnchor="middle">
          CURIOSIDADES
        </textPath>
      </text>

      {/* moldura da vitrine */}
      <path
        d="M172 806V438Q172 336 402 336Q632 336 632 438V806Z"
        fill="none"
        stroke="var(--wood-2)"
        strokeWidth="20"
      />
      <path
        d="M182 806V440Q182 348 402 348Q622 348 622 440V806"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* base da vitrine */}
      <rect x="160" y="816" width="484" height="118" fill="var(--wood)" />
      <rect x="182" y="836" width="200" height="78" fill="none" stroke="var(--brass)" strokeOpacity="0.35" />
      <rect x="420" y="836" width="200" height="78" fill="none" stroke="var(--brass)" strokeOpacity="0.35" />

      {/* pilastras */}
      {[112, 644, 868].map((x) => (
        <g key={x}>
          <rect x={x} y="300" width={x === 868 ? 20 : 30} height="650" fill="var(--wood-2)" />
          <rect x={x - 4} y="300" width={(x === 868 ? 20 : 30) + 8} height="14" fill="var(--wood-2)" />
        </g>
      ))}

      {/* porta */}
      <rect x="684" y="336" width="172" height="606" fill="var(--wood-2)" />
      <g clipPath="url(#sf-door-glass)">
        <rect x="700" y="360" width="140" height="290" fill="url(#sf-interior)" opacity="0.7" />
        <rect x="700" y="360" width="140" height="290" fill="url(#sf-interior)" opacity="0.5" className="sf__surge" />
        <path d="M708 540L790 368H818L708 600Z" fill="#fff" opacity="0.05" />
      </g>
      <path
        d="M708 640V408Q708 368 770 368Q832 368 832 408V640Z"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <rect x="708" y="664" width="124" height="112" fill="none" stroke="var(--brass)" strokeOpacity="0.35" />
      <rect x="708" y="796" width="124" height="128" fill="none" stroke="var(--brass)" strokeOpacity="0.35" />
      <circle cx="716" cy="700" r="7" fill="var(--brass)" />

      {/* placa "aberto" pendurada no vidro da porta */}
      <path d="M742 392L726 432M798 392L814 432" stroke="#d9c7ae" strokeWidth="1.5" />
      <circle cx="770" cy="388" r="3" fill="var(--brass)" />
      <g className="sf__open-sign">
        <rect x="716" y="430" width="108" height="58" rx="3" fill="#efe2cc" />
        <rect x="721" y="435" width="98" height="48" rx="2" fill="none" stroke="#6b2a46" strokeWidth="1" />
        <text x="770" y="462" textAnchor="middle" className="sf__open">
          ABERTO
        </text>
        <text x="770" y="477" textAnchor="middle" className="sf__open-small">
          A NOITE TODA
        </text>
      </g>

      {/* degrau e calçada */}
      <rect x="672" y="942" width="196" height="14" fill="var(--stone-2)" />
      <rect y="950" width="1000" height="90" fill="url(#sf-sidewalk)" />
      <rect y="950" width="1000" height="4" fill="url(#sf-curb)" />
      <path d="M150 956H650L700 1040H100Z" fill="url(#sf-reflect)" className="sf__reflect" />

    </svg>
  )
}
