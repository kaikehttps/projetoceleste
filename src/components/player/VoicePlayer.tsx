import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type Ref,
} from 'react'
import { AlertTriangle, LoaderCircle, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { director } from '../../audio/director'
import { formatTime, spokenTime } from '../../audio/format'
import type { Track } from '../../data/recordings'
import { Waveform } from './Waveform'
import './VoicePlayer.css'

export type PlayerHandle = {
  play: () => void
  pause: () => void
  toggle: () => void
}

export type PlayerVariant = 'shop' | 'urn' | 'dossier' | 'farewell'

type Props = {
  /** Identificador único na página (controle central de reprodução). */
  id: string
  track: Track
  /** Rótulo editorial, ex.: "Registro de voz Nº 001". */
  label: string
  variant: PlayerVariant
  ref?: Ref<PlayerHandle>
  /** Quando muda (e é > 0), começa a tocar a faixa atual. Usado pelas coleções. */
  playToken?: number
  onPrev?: () => void
  onNext?: () => void
  /** Texto do grupo de capítulos, ex.: "Interações gravadas". */
  chaptersLabel?: string
  compact?: boolean
}

type Status = 'loading' | 'ready' | 'error'

const SEEK_STEP = 5

export function VoicePlayer({
  id,
  track,
  label,
  variant,
  ref,
  playToken = 0,
  onPrev,
  onNext,
  chaptersLabel = 'Capítulos',
  compact = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)
  const trackRef = useRef(track)
  trackRef.current = track
  const labelRef = useRef(label)
  labelRef.current = label

  const [status, setStatus] = useState<Status>('loading')
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [duration, setDuration] = useState(track.duration)
  const [time, setTime] = useState(0)

  const durationRef = useRef(duration)
  durationRef.current = duration

  // Atualiza o progresso visual direto no DOM (variável --p) e o tempo exibido
  // só quando o segundo muda — o React não re-renderiza a cada quadro.
  const paint = useCallback((t: number) => {
    const d = durationRef.current
    rootRef.current?.style.setProperty('--p', d > 0 ? String(Math.min(1, t / d)) : '0')
    setTime((prev) => (Math.floor(prev) === Math.floor(t) ? prev : t))
  }, [])

  // Registro no controle central
  useEffect(() => {
    const audio = audioRef.current
    const root = rootRef.current
    if (!audio || !root) return
    return director.register(id, {
      audio,
      root,
      getLabel: () => labelRef.current,
      getTrack: () => trackRef.current,
    })
  }, [id])

  // Eventos do elemento de áudio
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    let frame = 0
    const loop = () => {
      if (!draggingRef.current) paint(a.currentTime)
      frame = requestAnimationFrame(loop)
    }
    const onMeta = () => {
      if (Number.isFinite(a.duration) && a.duration > 0) setDuration(a.duration)
      setStatus('ready')
    }
    const onPlay = () => {
      setPlaying(true)
      setBuffering(a.readyState < 3)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }
    const onPlaying = () => setBuffering(false)
    const onWaiting = () => setBuffering(true)
    const onPause = () => {
      setPlaying(false)
      setBuffering(false)
      cancelAnimationFrame(frame)
      paint(a.currentTime)
    }
    const onSeeked = () => {
      if (a.paused && !draggingRef.current) paint(a.currentTime)
    }
    const onError = () => {
      setStatus('error')
      setPlaying(false)
      setBuffering(false)
    }
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('durationchange', onMeta)
    a.addEventListener('play', onPlay)
    a.addEventListener('playing', onPlaying)
    a.addEventListener('waiting', onWaiting)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onPause)
    a.addEventListener('seeked', onSeeked)
    a.addEventListener('error', onError)
    if (a.readyState >= 1) onMeta()
    if (a.error) onError()
    return () => {
      cancelAnimationFrame(frame)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('durationchange', onMeta)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('playing', onPlaying)
      a.removeEventListener('waiting', onWaiting)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onPause)
      a.removeEventListener('seeked', onSeeked)
      a.removeEventListener('error', onError)
    }
  }, [paint])

  const play = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.error) {
      setStatus('loading')
      a.load()
    }
    setBuffering(true)
    a.play().catch((err: DOMException) => {
      setBuffering(false)
      if (err.name === 'AbortError' || err.name === 'NotAllowedError') return
      setStatus('error')
    })
  }, [])

  const pause = useCallback(() => audioRef.current?.pause(), [])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play()
    else a.pause()
  }, [play])

  useImperativeHandle(ref, () => ({ play, pause, toggle }), [play, pause, toggle])

  // Troca de faixa (coleções): volta ao início e, se pedido, toca a nova.
  const lastTrack = useRef(track.id)
  const lastToken = useRef(playToken)
  useEffect(() => {
    if (lastTrack.current !== track.id) {
      lastTrack.current = track.id
      setDuration(track.duration)
      setStatus('loading')
      paint(0)
      director.touch(id)
    }
    if (playToken !== lastToken.current) {
      lastToken.current = playToken
      if (playToken > 0) play()
    }
  }, [track.id, track.duration, playToken, id, paint, play])

  const seekTo = useCallback(
    (t: number) => {
      const a = audioRef.current
      if (!a) return
      const d = durationRef.current
      const next = Math.max(0, Math.min(d, t))
      a.currentTime = next
      paint(next)
    },
    [paint],
  )

  // ——— Barra de progresso: clique, arraste e teclado ———

  const ratioAt = (clientX: number) => {
    const r = sliderRef.current!.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width))
  }

  const showHover = (clientX: number) => {
    const ratio = ratioAt(clientX)
    sliderRef.current?.style.setProperty('--hx', String(ratio))
    if (hoverRef.current) hoverRef.current.textContent = formatTime(ratio * durationRef.current)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = true
    rootRef.current?.setAttribute('data-dragging', '')
    const ratio = ratioAt(e.clientX)
    rootRef.current?.style.setProperty('--p', String(ratio))
    setTime(ratio * durationRef.current)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    showHover(e.clientX)
    if (!draggingRef.current) return
    const ratio = ratioAt(e.clientX)
    rootRef.current?.style.setProperty('--p', String(ratio))
    setTime(ratio * durationRef.current)
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    rootRef.current?.removeAttribute('data-dragging')
    if (commit) seekTo(ratioAt(e.clientX) * durationRef.current)
    else paint(audioRef.current?.currentTime ?? 0)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a) return
    const step = e.shiftKey ? SEEK_STEP * 2 : SEEK_STEP
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        seekTo(a.currentTime + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        seekTo(a.currentTime - step)
        break
      case 'PageUp':
        seekTo(a.currentTime + 15)
        break
      case 'PageDown':
        seekTo(a.currentTime - 15)
        break
      case 'Home':
        seekTo(0)
        break
      case 'End':
        seekTo(durationRef.current)
        break
      case ' ':
      case 'k':
        toggle()
        break
      default:
        return
    }
    e.preventDefault()
  }

  const playChapter = (at: number) => {
    seekTo(at)
    if (audioRef.current?.paused) play()
  }

  const currentChapter = track.chapters?.reduce<number>((acc, c, i) => (time >= c.at - 0.05 ? i : acc), -1) ?? -1

  const statusText =
    status === 'error'
      ? 'Indisponível'
      : buffering
        ? 'Carregando…'
        : playing
          ? 'Tocando'
          : time > 0
            ? 'Pausado'
            : 'Pronto para ouvir'

  const actionLabel = `${playing ? 'Pausar' : 'Reproduzir'}: ${track.title}`

  return (
    <div
      ref={rootRef}
      className={`vp vp--${variant}${compact ? ' vp--compact' : ''}`}
      data-playing={playing || undefined}
      data-status={status}
    >
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="vp__head">
        <span className="vp__label">{label}</span>
        <span className="vp__status" aria-live="polite">
          <span className="vp__status-dot" aria-hidden="true" />
          {statusText}
        </span>
      </div>

      <div className="vp__main">
        <button
          type="button"
          className="vp__play"
          onClick={toggle}
          aria-label={actionLabel}
          disabled={status === 'error'}
        >
          <span className="vp__play-ring" aria-hidden="true" />
          {buffering && playing ? (
            <LoaderCircle className="vp__icon vp__icon--spin" aria-hidden="true" />
          ) : playing ? (
            <Pause className="vp__icon" aria-hidden="true" />
          ) : (
            <Play className="vp__icon vp__icon--play" aria-hidden="true" />
          )}
        </button>

        <div className="vp__body">
          <div className="vp__titles">
            <p className="vp__title">{track.title}</p>
            {track.subtitle && <p className="vp__sub">{track.subtitle}</p>}
          </div>

          <div
            ref={sliderRef}
            className="vp__slider"
            role="slider"
            tabIndex={0}
            aria-label={`Posição na gravação ${track.title}`}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${spokenTime(time)} de ${spokenTime(duration)}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endDrag(e, true)}
            onPointerCancel={(e) => endDrag(e, false)}
            onPointerEnter={(e) => showHover(e.clientX)}
            onKeyDown={onKeyDown}
          >
            <Waveform
              peaks={track.peaks}
              barWidth={variant === 'farewell' ? 2 : 3}
              gap={variant === 'urn' ? 3 : 2}
            />
            {track.chapters?.map((c) => (
              <span
                key={c.at}
                className="vp__tick"
                style={{ '--at': c.at / duration } as CSSProperties}
                aria-hidden="true"
              />
            ))}
            <span className="vp__head-line" aria-hidden="true" />
            <span className="vp__hover" ref={hoverRef} aria-hidden="true" />
          </div>

          <div className="vp__times">
            <span className="vp__time">{formatTime(time)}</span>
            {(onPrev || onNext) && (
              <span className="vp__skip">
                <button type="button" onClick={onPrev} disabled={!onPrev} aria-label="Fala anterior">
                  <SkipBack aria-hidden="true" />
                </button>
                <button type="button" onClick={onNext} disabled={!onNext} aria-label="Próxima fala">
                  <SkipForward aria-hidden="true" />
                </button>
              </span>
            )}
            <span className="vp__time vp__time--total">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {track.chapters && !compact && (
        <div className="vp__chapters">
          <p className="vp__chapters-label">{chaptersLabel}</p>
          <ul>
            {track.chapters.map((c, i) => (
              <li key={c.at}>
                <button
                  type="button"
                  onClick={() => playChapter(c.at)}
                  aria-current={currentChapter === i && (playing || time > 0) ? 'true' : undefined}
                  aria-label={`Ouvir a partir de ${formatTime(c.at)}: ${c.label}`}
                >
                  <span className="vp__chapter-name">{c.label}</span>
                  <span className="vp__chapter-time">{formatTime(c.at)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && (
        <div className="vp__error" role="alert">
          <AlertTriangle aria-hidden="true" />
          <span>Não foi possível carregar esta gravação.</span>
          <button
            type="button"
            onClick={() => {
              setStatus('loading')
              audioRef.current?.load()
            }}
          >
            <RotateCcw aria-hidden="true" /> Tentar de novo
          </button>
        </div>
      )}
    </div>
  )
}
