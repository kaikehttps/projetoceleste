import { useSyncExternalStore } from 'react'
import { site } from '../config'
import { director } from './director'

/**
 * Música de fundo.
 *
 * - Só começa com um clique (os navegadores bloqueiam som automático).
 * - Volume pelo Web Audio (GainNode): funciona até no iPhone, onde o volume
 *   do elemento <audio> não pode ser alterado.
 * - Se cala sozinha quando uma dublagem toca e volta devagar depois.
 * - Pausa quando a aba fica em segundo plano.
 */

export type MusicState = {
  /** null enquanto verifica se o arquivo existe. */
  available: boolean | null
  /** O visitante quer a música ligada. */
  enabled: boolean
  /** Está soando de fato (ligada, sem dublagem tocando, aba visível). */
  audible: boolean
}

const SRC = `${import.meta.env.BASE_URL}${site.music.src}`
const FADE_IN = 2.4
const FADE_OUT = 0.7

class BackgroundMusic {
  private state: MusicState = { available: null, enabled: false, audible: false }
  private listeners = new Set<() => void>()
  private audio?: HTMLAudioElement
  private ctx?: AudioContext
  private gain?: GainNode
  private ducked = false
  private hidden = typeof document !== 'undefined' && document.hidden
  private fadeTimer = 0
  private fadeFrame = 0

  constructor() {
    if (typeof window === 'undefined') return
    this.probe()
    director.subscribe(() => {
      const ducked = director.getState().playing
      if (ducked !== this.ducked) {
        this.ducked = ducked
        this.apply()
      }
    })
    document.addEventListener('visibilitychange', () => {
      this.hidden = document.hidden
      this.apply()
    })
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getState = () => this.state

  /** Liga ou desliga. Chame a partir de um clique. */
  setEnabled(enabled: boolean) {
    if (!this.state.available) return
    if (enabled) this.ensure()
    this.set({ enabled })
    this.apply()
  }

  toggle() {
    this.setEnabled(!this.state.enabled)
  }

  private set(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch }
    for (const fn of this.listeners) fn()
  }

  /** Confere se o arquivo existe e é mesmo áudio (o servidor de dev devolve HTML para caminhos inexistentes). */
  private async probe() {
    try {
      const res = await fetch(SRC, { method: 'HEAD' })
      const type = res.headers.get('content-type') ?? ''
      this.set({ available: res.ok && /audio|octet-stream/.test(type) })
    } catch {
      this.set({ available: false })
    }
  }

  /** Cria o áudio e o contexto dentro do gesto do usuário. */
  private ensure() {
    if (this.audio) {
      this.ctx?.resume().catch(() => {})
      return
    }
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.addEventListener('error', () => this.set({ available: false, enabled: false, audible: false }))
    this.audio = audio
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const gain = ctx.createGain()
      gain.gain.value = 0
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination)
      this.ctx = ctx
      this.gain = gain
    } catch {
      audio.volume = 0
    }
  }

  private apply() {
    const audio = this.audio
    if (!audio) return
    const want = this.state.enabled && !this.ducked && !this.hidden
    clearTimeout(this.fadeTimer)
    if (want) {
      this.ctx?.resume().catch(() => {})
      audio.play().catch(() => {})
      this.fadeTo(site.music.volume, FADE_IN)
    } else {
      this.fadeTo(0, FADE_OUT)
      this.fadeTimer = window.setTimeout(() => audio.pause(), FADE_OUT * 1000 + 60)
    }
    this.set({ audible: want })
  }

  private fadeTo(target: number, seconds: number) {
    if (this.gain && this.ctx) {
      const g = this.gain.gain
      const now = this.ctx.currentTime
      g.cancelScheduledValues(now)
      g.setValueAtTime(g.value, now)
      g.linearRampToValueAtTime(target, now + seconds)
      return
    }
    // sem Web Audio: anima o volume do próprio elemento
    const audio = this.audio!
    cancelAnimationFrame(this.fadeFrame)
    const from = audio.volume
    const start = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / (seconds * 1000))
      audio.volume = from + (target - from) * k
      if (k < 1) this.fadeFrame = requestAnimationFrame(step)
    }
    this.fadeFrame = requestAnimationFrame(step)
  }
}

export const music = new BackgroundMusic()

export function useMusic() {
  return useSyncExternalStore(music.subscribe, music.getState, music.getState)
}
