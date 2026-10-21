import { useLayoutEffect, useMemo, useRef, useState } from 'react'

type Props = {
  /** Intensidades 0–100 calculadas do arquivo real (npm run audio). */
  peaks: number[]
  barWidth?: number
  gap?: number
  /** Altura mínima de cada barra, em fração da altura total. */
  floor?: number
}

/** Reamostra mantendo os picos, para caber na largura disponível. */
function resample(peaks: number[], count: number) {
  const out: number[] = []
  const size = peaks.length / count
  for (let i = 0; i < count; i++) {
    const a = Math.floor(i * size)
    const b = Math.max(a + 1, Math.floor((i + 1) * size))
    let max = 0
    let sum = 0
    for (let j = a; j < b; j++) {
      max = Math.max(max, peaks[j])
      sum += peaks[j]
    }
    out.push((max * 0.65 + (sum / (b - a)) * 0.35) / 100)
  }
  return out
}

function barsPath(values: number[], height: number, bw: number, gap: number, floor: number) {
  const r = Math.min(bw / 2, 2)
  let d = ''
  values.forEach((v, i) => {
    const h = Math.max(floor, v) * height
    const x = i * (bw + gap)
    const y = (height - h) / 2
    const body = Math.max(0, h - 2 * r)
    d +=
      `M${x} ${y + r}a${r} ${r} 0 0 1 ${r} ${-r}h${bw - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}` +
      `v${body}a${r} ${r} 0 0 1 ${-r} ${r}h${-(bw - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}z`
  })
  return d
}

/**
 * Forma de onda em duas camadas: a base e a parte já ouvida, recortada
 * pela variável CSS `--p` (0–1) definida pelo player — sem re-render a cada quadro.
 */
export function Waveform({ peaks, barWidth = 3, gap = 2, floor = 0.06 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize((s) => {
        const w = Math.round(r.width)
        const h = Math.round(r.height)
        return s.w === w && s.h === h ? s : { w, h }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const d = useMemo(() => {
    if (!size.w || !size.h) return ''
    const count = Math.max(16, Math.min(peaks.length, Math.floor((size.w + gap) / (barWidth + gap))))
    const bw = (size.w + gap) / count - gap
    return barsPath(resample(peaks, count), size.h, bw, gap, floor)
  }, [peaks, size, barWidth, gap, floor])

  return (
    <div className="wf" ref={ref} aria-hidden="true">
      {d && (
        <>
          <svg className="wf__layer wf__base" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <path d={d} />
          </svg>
          <svg className="wf__layer wf__played" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <path d={d} />
          </svg>
        </>
      )}
    </div>
  )
}
