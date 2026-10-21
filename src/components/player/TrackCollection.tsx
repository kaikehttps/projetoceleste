import { useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useIsPlaying } from '../../audio/hooks'
import { formatTime, totalDuration } from '../../audio/format'
import type { Track } from '../../data/recordings'
import { VoicePlayer, type PlayerHandle, type PlayerVariant } from './VoicePlayer'
import './TrackCollection.css'

type Props = {
  id: string
  tracks: Track[]
  variant: PlayerVariant
  /** Ex.: "Fala" → "Fala 03 de 07". */
  itemLabel: string
  /** Antes do número no rótulo do player, ex.: "A Urna". */
  labelPrefix?: string
  title: string
}

const n2 = (n: number) => String(n).padStart(2, '0')

/**
 * Uma pequena coleção de gravações com um único player: só existe um elemento
 * de áudio, então duas falas nunca tocam juntas.
 */
export function TrackCollection({ id, tracks, variant, itemLabel, labelPrefix, title }: Props) {
  const [index, setIndex] = useState(0)
  const [playToken, setPlayToken] = useState(0)
  const player = useRef<PlayerHandle>(null)
  const playing = useIsPlaying([id])
  const total = totalDuration(tracks.map((t) => t.duration))

  const select = (i: number) => {
    if (i === index) {
      player.current?.toggle()
      return
    }
    setIndex(i)
    setPlayToken((t) => t + 1)
  }

  const track = tracks[index]

  return (
    <div className={`collection collection--${variant}`}>
      <VoicePlayer
        ref={player}
        id={id}
        track={track}
        variant={variant}
        label={`${labelPrefix ? `${labelPrefix} · ` : ''}${itemLabel} ${n2(index + 1)} de ${n2(tracks.length)}`}
        playToken={playToken}
        onPrev={index > 0 ? () => select(index - 1) : undefined}
        onNext={index < tracks.length - 1 ? () => select(index + 1) : undefined}
        chaptersLabel="Pule para uma interação"
      />

      <div className="collection__list">
        <div className="collection__head">
          <p className="label">{title}</p>
          <p className="label collection__total">
            {tracks.length} gravações · {formatTime(total)}
          </p>
        </div>
        <ol>
          {tracks.map((t, i) => {
            const current = i === index
            const live = current && playing
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className="collection__item"
                  aria-current={current ? 'true' : undefined}
                  data-live={live || undefined}
                  onClick={() => select(i)}
                  aria-label={`${live ? 'Pausar' : 'Reproduzir'} ${itemLabel.toLowerCase()} ${n2(i + 1)}: ${t.title}, ${formatTime(t.duration)}`}
                >
                  <span className="collection__n">{n2(i + 1)}</span>
                  <span className="collection__text">
                    <span className="collection__title">{t.title}</span>
                    {t.subtitle && <span className="collection__sub">{t.subtitle}</span>}
                  </span>
                  <span className="collection__state" aria-hidden="true">
                    {live ? (
                      <>
                        <span className="eq">
                          <i />
                          <i />
                          <i />
                        </span>
                        <Pause />
                      </>
                    ) : (
                      <Play />
                    )}
                  </span>
                  <span className="collection__dur">{formatTime(t.duration)}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
