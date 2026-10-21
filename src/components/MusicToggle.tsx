import { VolumeX } from 'lucide-react'
import { music, useMusic } from '../audio/music'
import { site } from '../config'
import './MusicToggle.css'

/** Liga e desliga a música de fundo. Some se o arquivo de música não existir. */
export function MusicToggle() {
  const { available, enabled, audible } = useMusic()
  if (!available) return null
  const label = enabled ? 'Desligar a música de fundo' : 'Ligar a música de fundo'
  return (
    <button
      type="button"
      className="icon-btn music-toggle"
      onClick={() => music.toggle()}
      aria-pressed={enabled}
      aria-label={label}
      title={`${label} · ${site.music.title}`}
      data-audible={audible || undefined}
    >
      {enabled ? (
        <span className="music-toggle__eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : (
        <VolumeX aria-hidden="true" />
      )}
    </button>
  )
}
