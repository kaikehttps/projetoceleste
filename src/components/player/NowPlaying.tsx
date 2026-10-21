import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Pause, Play, X } from 'lucide-react'
import { director } from '../../audio/director'
import { useDirectorState } from '../../audio/hooks'
import './NowPlaying.css'

/**
 * Mini player fixo: aparece quando uma gravação está ativa e o player dela
 * saiu da tela, para a reprodução continuar sob controle durante a rolagem.
 */
export function NowPlaying() {
  const { activeId, playing } = useDirectorState()
  const entry = director.get(activeId)
  const barRef = useRef<HTMLDivElement>(null)
  const [offscreen, setOffscreen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (playing) setDismissed(false)
  }, [playing, activeId])

  useEffect(() => {
    if (!entry) return
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.15 })
    io.observe(entry.root)
    return () => io.disconnect()
  }, [entry])

  // progresso fino enquanto toca
  useEffect(() => {
    if (!entry || !playing) return
    let frame = 0
    const loop = () => {
      const d = entry.audio.duration || entry.getTrack().duration
      barRef.current?.style.setProperty('--p', String(d ? entry.audio.currentTime / d : 0))
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [entry, playing])

  const started = !!entry && (playing || entry.audio.currentTime > 0)
  const visible = !!entry && started && offscreen && !dismissed
  const track = entry?.getTrack()

  return (
    <aside className="now-playing" data-visible={visible || undefined} aria-label="Reproduzindo agora" inert={!visible}>
      {entry && track && (
        <>
          <button
            type="button"
            className="np__play"
            onClick={() => (entry.audio.paused ? entry.audio.play().catch(() => {}) : entry.audio.pause())}
            aria-label={`${playing ? 'Pausar' : 'Reproduzir'}: ${track.title}`}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <div className="np__text">
            <span className="np__label">{entry.getLabel()}</span>
            <span className="np__title">{track.title}</span>
          </div>
          <button
            type="button"
            className="np__icon"
            onClick={() => {
              entry.root.scrollIntoView({ block: 'center' })
              entry.root.querySelector<HTMLButtonElement>('.vp__play')?.focus({ preventScroll: true })
            }}
            aria-label="Ir até o player desta gravação"
          >
            <ArrowUpRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="np__icon"
            onClick={() => {
              entry.audio.pause()
              setDismissed(true)
            }}
            aria-label="Pausar e fechar o mini player"
          >
            <X aria-hidden="true" />
          </button>
          <div className="np__bar" ref={barRef} aria-hidden="true" />
        </>
      )}
    </aside>
  )
}
