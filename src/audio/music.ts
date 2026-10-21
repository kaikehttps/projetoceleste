import { useSyncExternalStore } from 'react'
import { site } from '../config'
import { director } from './director'

/**
 * Música de fundo.
 *
 * - Tenta começar sozinha assim que a página abre (autoStart). Os navegadores
 *   costumam bloquear som sem interação; nesse caso ela entra no primeiro
 *   clique, toque ou tecla em qualquer lugar da página.
 * - Dois volumes: "menu" na tela de entrada e "background" no site.
 * - Volume pelo Web Audio (GainNode): funciona até no iPhone, onde o volume
 *   do elemento <audio> não pode ser alterado.
 * - Um AnalyserNode antes do volume permite que os visuais reajam à música
 *   mesmo quando ela está baixinha.
 * - Se cala sozinha quando uma dublagem toca e volta devagar depois.
 * - Pausa quando a aba fica em segundo plano.
 */

export type MusicMode = 'menu' | 'background'

export type MusicState = {
  /** null enquanto verifica se o arquivo existe. */
  available: boolean | null
  /** O visitante quer a música ligada. */
  enabled: boolean
  /** Está soando de fato (ligada, sem dublagem tocando, aba visível). */
  audible: boolean
  mode: MusicMode
}

const SRC = `${import.meta.env.BASE_URL}${site.music.src}`
const FADE_IN = 1.6
const FADE_OUT = 0.7
const MODE_FADE = 3.5
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']
const BANDS: [number, number][] = [
  [1, 5], // graves
  [6, 20],
  [21, 80],
  [81, 240], // agudos
]

class BackgroundMusic {
  private state: MusicState = { available: null, enabled: false, audible: false, mode: 'menu' }
  private listeners = new Set<() => void>()
  private audio?: HTMLAudioElement
  private ctx?: AudioContext
  private gain?: GainNode
  private analyser?: AnalyserNode
  private freq?: Uint8Array<ArrayBuffer>
  private bands = new Float32Array(4)
  private ducked = false
  private hidden = typeof document !== 'undefined' && document.hidden
  private fadeTimer = 0
  private fadeFrame = 0
  private noWebAudio = false
  private autoTried = false
  private armed = false
  private applyId = 0

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

  /**
   * Tenta tocar já na abertura. Se o navegador bloquear, fica à espera do
   * primeiro gesto (clique, toque ou tecla) e começa nele.
   */
  autoStart(mode: MusicMode) {
    if (this.state.available !== true || this.autoTried) return
    this.autoTried = true
    this.set({ enabled: true, mode })
    this.ensure()
    this.apply()
    this.arm()
  }

  /** Liga a música num modo. Chame a partir de um clique ou tecla. */
  start(mode: MusicMode) {
    if (this.state.available === false) return
    this.ensure()
    this.set({ enabled: true, mode })
    this.apply()
  }

  /** Muda o volume entre a tela de entrada e o fundo do site, com transição longa. */
  setMode(mode: MusicMode) {
    if (mode === this.state.mode) return
    this.set({ mode })
    if (this.state.audible) this.fadeTo(this.targetVolume(), MODE_FADE)
  }

  /** Liga ou desliga. Chame a partir de um clique. */
  setEnabled(enabled: boolean) {
    if (this.state.available === false) return
    if (enabled) this.ensure()
    this.set({ enabled })
    if (!enabled) this.disarm()
    this.apply()
  }

  toggle() {
    this.setEnabled(!this.state.enabled)
  }

  /** Baixa a trilha antes do gesto, para ela entrar sem atraso. Não toca nada. */
  preload() {
    if (this.state.available === true && !this.audio) this.createElement()
  }

  /**
   * Energia da música em 4 faixas (graves → agudos), de 0 a 1.
   * Lida a cada quadro pelos visuais; retorna zeros quando não há música soando.
   */
  readBands() {
    if (!this.analyser || !this.freq || !this.state.audible) {
      this.bands.fill(0)
      return this.bands
    }
    this.analyser.getByteFrequencyData(this.freq)
    BANDS.forEach(([a, b], i) => {
      let sum = 0
      for (let k = a; k <= b; k++) sum += this.freq![k]
      this.bands[i] = sum / ((b - a + 1) * 255)
    })
    return this.bands
  }

  private targetVolume() {
    return this.state.mode === 'menu' ? site.music.menuVolume : site.music.volume
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
      this.set({ available: res.ok && /audio|octet-stream|mp4/.test(type) })
    } catch {
      this.set({ available: false })
    }
  }

  private createElement() {
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.addEventListener('error', () => this.set({ available: false, enabled: false, audible: false }))
    this.audio = audio
    return audio
  }

  /** Cria o contexto de áudio dentro do gesto do usuário. */
  private ensure() {
    const audio = this.audio ?? this.createElement()
    if (this.ctx || this.noWebAudio) {
      this.ctx?.resume().catch(() => {})
      return
    }
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const source = ctx.createMediaElementSource(audio)
      const gain = ctx.createGain()
      gain.gain.value = 0
      source.connect(gain).connect(ctx.destination)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.72
      source.connect(analyser)
      this.ctx = ctx
      this.gain = gain
      this.analyser = analyser
      this.freq = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      this.noWebAudio = true
      audio.volume = 0
    }
  }

  /** Toca de verdade? O navegador pode negar o play ou deixar o contexto de áudio suspenso. */
  private async attempt() {
    const audio = this.audio!
    const ctx = this.ctx
    try {
      await audio.play()
      if (ctx && ctx.state !== 'running') {
        await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 350))])
        if ((ctx.state as AudioContextState) !== 'running') {
          audio.pause()
          return false
        }
      }
      return true
    } catch {
      return false
    }
  }

  private apply() {
    const audio = this.audio
    if (!audio) return
    const want = this.state.enabled && !this.ducked && !this.hidden
    const id = ++this.applyId
    clearTimeout(this.fadeTimer)
    if (want) {
      this.fadeTo(this.targetVolume(), FADE_IN)
      this.attempt().then((ok) => {
        if (id !== this.applyId) return
        if (ok) this.disarm()
        else this.fadeTo(0, 0.01)
        this.set({ audible: ok })
      })
      return
    }
    if (this.gain || this.noWebAudio) {
      this.fadeTo(0, FADE_OUT)
      this.fadeTimer = window.setTimeout(() => audio.pause(), FADE_OUT * 1000 + 60)
    } else {
      audio.pause()
    }
    this.set({ audible: false })
  }

  /** Espera o primeiro gesto do visitante para liberar o som bloqueado. */
  private onGesture = (e: Event) => {
    if ((e.target as Element | null)?.closest?.('[data-music-control]')) return
    if (!this.state.enabled || this.state.audible || this.state.available !== true) return
    this.ensure()
    this.apply()
  }

  private arm() {
    if (this.armed) return
    this.armed = true
    for (const t of GESTURES) window.addEventListener(t, this.onGesture, true)
  }

  private disarm() {
    if (!this.armed) return
    this.armed = false
    for (const t of GESTURES) window.removeEventListener(t, this.onGesture, true)
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
