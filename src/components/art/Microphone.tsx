/**
 * Microfone de carvão suspenso por molas (rádio dos anos 1920–30),
 * desenhado como gravura técnica numa ficha de arquivo.
 */
export function Microphone({ className = '' }: { className?: string }) {
  const springs = [0, 45, 90, 135, 180, 225, 270, 315]
  const zig = 'M0 -40l4 3-8 3 8 3-8 3 8 3-8 3 8 3-8 3 4 2'
  return (
    <svg className={className} viewBox="-50 0 340 420" role="img" aria-label="Gravura de um microfone antigo suspenso por molas">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* anel externo */}
        <circle cx="120" cy="120" r="92" strokeWidth="2.2" />
        <circle cx="120" cy="120" r="84" strokeWidth="0.8" strokeDasharray="1 4" />
        {/* molas */}
        {springs.map((a) => (
          <g key={a} transform={`translate(120 120) rotate(${a}) translate(0 -44)`}>
            <path d={zig} strokeWidth="1.1" transform="scale(1 0.95)" />
          </g>
        ))}
        {/* cápsula */}
        <circle cx="120" cy="120" r="42" strokeWidth="2" />
        <circle cx="120" cy="120" r="34" strokeWidth="0.8" />
        {/* grade */}
        <g strokeWidth="0.7">
          {[-24, -16, -8, 0, 8, 16, 24].map((d) => {
            const h = Math.sqrt(30 * 30 - d * d)
            return <path key={d} d={`M${120 + d} ${120 - h}V${120 + h}`} />
          })}
        </g>
        {/* garfo e haste */}
        <path d="M28 120Q28 214 120 214Q212 214 212 120" strokeWidth="2" />
        <path d="M120 214V380" strokeWidth="3" />
        <path d="M112 236h16M112 300h16" strokeWidth="1.4" />
        {/* base */}
        <path d="M64 404Q64 380 120 380Q176 380 176 404Z" strokeWidth="2" />
        <path d="M54 404h132" strokeWidth="2.4" />
      </g>
      {/* anotações de gravura */}
      <g className="mic__notes" fill="currentColor" fontFamily="var(--font-label)" fontSize="11" fontWeight="700" letterSpacing="2">
        <path d="M176 64L222 26H246" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <text x="226" y="18">MOLAS</text>
        <path d="M146 132L232 150H258" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <text x="232" y="142">GRADE</text>
        <path d="M120 304L-4 326H-40" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <text x="-44" y="318">SUPORTE</text>
      </g>
    </svg>
  )
}
