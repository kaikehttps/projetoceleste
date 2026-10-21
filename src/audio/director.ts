import { ENVELOPE_HZ, type Track } from '../data/recordings'

/**
 * Controle central de reprodução.
 *
 * - Só uma gravação toca por vez: ao iniciar um player, os outros pausam.
 * - Mantém quem está ativo (para o mini player flutuante).
 * - Enquanto algo toca, publica o "nível" da voz (0–1), lido do envelope
 *   pré-calculado do próprio arquivo, para as cenas reagirem ao áudio.
 *   Quando pausa, o nível decai até zero e o loop para.
 */

export type PlayerEntry = {
  audio: HTMLAudioElement
  root: HTMLElement
  /** Rótulo do player, ex.: "Registro Nº 001 · O Vendedor". */
  getLabel: () => string
  getTrack: () => Track
}

export type DirectorState = {
  activeId: string | null
  playing: boolean
  /** Incrementa a cada mudança (inclusive troca de faixa numa coleção). */
  revision: number
}

type LevelListener = (activeId: string | null, level: number) => void

class AudioDirector {
  private entries = new Map<string, PlayerEntry>()
  private state: DirectorState = { activeId: null, playing: false, revision: 0 }
  private listeners = new Set<() => void>()
  private levelListeners = new Set<LevelListener>()
  private frame = 0
  private level = 0

  register(id: string, entry: PlayerEntry) {
    this.entries.set(id, entry)
    const { audio } = entry

    const onPlay = () => {
      for (const [otherId, other] of this.entries) {
        if (otherId !== id && !other.audio.paused) other.audio.pause()
      }
      this.setState({ activeId: id, playing: true })
      this.startLoop()
    }
    const onStop = () => {
      if (this.state.activeId === id) this.setState({ playing: false })
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onStop)
    audio.addEventListener('ended', onStop)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onStop)
      audio.removeEventListener('ended', onStop)
      this.entries.delete(id)
      if (this.state.activeId === id) this.setState({ activeId: null, playing: false })
    }
  }

  get(id: string | null) {
    return id ? this.entries.get(id) : undefined
  }

  /** Avisa que a faixa de um player mudou (ex.: outra fala da coleção). */
  touch(id: string) {
    if (this.state.activeId === id) this.setState({})
  }

  pauseAll() {
    for (const e of this.entries.values()) if (!e.audio.paused) e.audio.pause()
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getState = () => this.state

  onLevel(fn: LevelListener) {
    this.levelListeners.add(fn)
    fn(this.state.activeId, this.level)
    return () => {
      this.levelListeners.delete(fn)
    }
  }

  private setState(patch: Partial<DirectorState>) {
    this.state = { ...this.state, ...patch, revision: this.state.revision + 1 }
    for (const fn of this.listeners) fn()
  }

  private startLoop() {
    if (!this.frame) this.frame = requestAnimationFrame(this.tick)
  }

  private tick = () => {
    const entry = this.get(this.state.activeId)
    let target = 0
    if (entry && this.state.playing) {
      const env = entry.getTrack().envelope
      const pos = entry.audio.currentTime * ENVELOPE_HZ
      const i = Math.floor(pos)
      const a = env[i] ?? 0
      const b = env[i + 1] ?? a
      target = (a + (b - a) * (pos - i)) / 100
    }
    // ataque rápido, soltura lenta: parece luz reagindo à voz, não um medidor nervoso
    this.level += (target - this.level) * (target > this.level ? 0.4 : 0.1)
    if (!this.state.playing && this.level < 0.004) this.level = 0

    for (const fn of this.levelListeners) fn(this.state.activeId, this.level)

    this.frame = this.state.playing || this.level > 0 ? requestAnimationFrame(this.tick) : 0
  }
}

export const director = new AudioDirector()
