export function formatTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '--:--'
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Versão por extenso para leitores de tela: "1 minuto e 5 segundos". */
export function spokenTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  const parts = []
  if (m) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`)
  parts.push(`${r} ${r === 1 ? 'segundo' : 'segundos'}`)
  return parts.join(' e ')
}

export function totalDuration(durations: number[]) {
  return durations.reduce((a, b) => a + b, 0)
}
