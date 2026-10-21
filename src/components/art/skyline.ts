import { rng, type Rng } from '../../lib/random'

/**
 * Gerador de skyline de Nova York (anos 1920–30, com toque gótico).
 * Produz caminhos SVG prontos: o corpo dos prédios e as janelas acesas
 * (âmbar e rosa), além da posição das luzes de topo.
 */

export type Landmark = {
  x: number
  w: number
  h: number
  type: 'empire' | 'chrysler' | 'gothic' | 'deco'
}

export type SkylineOptions = {
  seed: number
  width: number
  height: number
  minH: number
  maxH: number
  minW: number
  maxW: number
  /** Multiplicador de altura conforme a posição horizontal (0–1). */
  profile?: (t: number) => number
  landmarks?: Landmark[]
  windows?: {
    density: number
    w: number
    h: number
    gx: number
    gy: number
    pink: number
  }
  detail?: Partial<Record<'setback' | 'gothic' | 'water' | 'antenna' | 'dome' | 'cornice', number>>
}

export type Skyline = {
  body: string
  warm: string
  pink: string
  beacons: { x: number; y: number }[]
}

const f = (n: number) => Math.round(n * 10) / 10

const rect = (x: number, y: number, w: number, h: number) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}z`

const tri = (x: number, y: number, w: number, h: number) =>
  `M${f(x)} ${f(y)}L${f(x + w / 2)} ${f(y - h)}L${f(x + w)} ${f(y)}z`

type Mass = { x: number; y: number; w: number; h: number }

class Builder {
  body = ''
  warm = ''
  pink = ''
  beacons: { x: number; y: number }[] = []
  masses: Mass[] = []
  constructor(
    readonly r: Rng,
    readonly o: SkylineOptions,
  ) {}

  mass(x: number, y: number, w: number, h: number, lit = true) {
    this.body += rect(x, y, w, h)
    if (lit) this.masses.push({ x, y, w, h })
  }

  spire(cx: number, top: number, w: number, h: number) {
    this.body += tri(cx - w / 2, top, w, h)
    this.body += rect(cx - 0.8, top - h - h * 0.35, 1.6, h * 0.4)
    this.beacons.push({ x: cx, y: top - h - h * 0.35 })
  }

  antenna(cx: number, top: number, h: number) {
    this.body += rect(cx - 1, top - h, 2, h)
    if (this.r.chance(0.5)) this.beacons.push({ x: cx, y: top - h })
  }

  waterTower(cx: number, top: number, s: number) {
    const tw = 16 * s
    const th = 16 * s
    const legs = 9 * s
    this.body += rect(cx - tw / 2 + 2 * s, top - legs, 2 * s, legs)
    this.body += rect(cx + tw / 2 - 4 * s, top - legs, 2 * s, legs)
    this.body += rect(cx - tw / 2, top - legs - th, tw, th)
    this.body += tri(cx - tw / 2 - 1.5 * s, top - legs - th, tw + 3 * s, 8 * s)
  }

  dome(cx: number, top: number, w: number) {
    const rx = w / 2
    this.body += `M${f(cx - rx)} ${f(top)}A${f(rx)} ${f(rx * 0.8)} 0 0 1 ${f(cx + rx)} ${f(top)}z`
    this.antenna(cx, top - rx * 0.8, w * 0.5)
  }

  /** Bloco com recuos art déco. Retorna o topo final. */
  setbacks(x: number, w: number, h: number, tiers: number) {
    const base = this.o.height
    let tx = x
    let tw = w
    let y = base - h * 0.55
    this.mass(tx, y, tw, base - y)
    const rest = h * 0.45
    for (let i = 1; i < tiers; i++) {
      const inset = tw * this.r.range(0.1, 0.18)
      tx += inset
      tw -= inset * 2
      const th = rest / (tiers - 1)
      y -= th
      this.mass(tx, y, tw, th)
    }
    return { cx: tx + tw / 2, top: y, w: tw }
  }

  plain(x: number, w: number, h: number) {
    const top = this.o.height - h
    this.mass(x, top, w, h)
    if (this.r.chance(this.o.detail?.cornice ?? 0.5)) this.body += rect(x - 2, top - 3, w + 4, 3)
    return { cx: x + w / 2, top, w }
  }

  gothic(x: number, w: number, h: number) {
    const top = this.o.height - h
    this.mass(x, top, w, h)
    this.body += tri(x, top, w, w * this.r.range(0.9, 1.5))
    this.body += tri(x - 2, top, 6, 14)
    this.body += tri(x + w - 4, top, 6, 14)
    this.beacons.push({ x: x + w / 2, y: top - w * 1.2 })
  }

  empire(l: Landmark) {
    const t = this.setbacks(l.x - l.w / 2, l.w, l.h * 0.78, 5)
    const mastW = t.w * 0.45
    this.mass(t.cx - mastW / 2, t.top - l.h * 0.08, mastW, l.h * 0.08, false)
    this.antenna(t.cx, t.top - l.h * 0.08, l.h * 0.14)
  }

  chrysler(l: Landmark) {
    const t = this.setbacks(l.x - l.w / 2, l.w, l.h * 0.72, 3)
    // coroa de arcos sobrepostos, com as janelas triangulares iluminadas
    let w = t.w
    let y = t.top
    for (let i = 0; i < 5; i++) {
      const ah = w * 0.42
      this.body += `M${f(t.cx - w / 2)} ${f(y)}A${f(w / 2)} ${f(ah)} 0 0 1 ${f(t.cx + w / 2)} ${f(y)}z`
      const tw = w * 0.16
      for (let k = -1; k <= 1; k++) {
        this.pink += tri(t.cx + k * w * 0.24 - tw / 2, y - ah * 0.18, tw, ah * 0.4)
      }
      y -= ah * 0.55
      w *= 0.74
    }
    this.spire(t.cx, y, w * 0.6, l.h * 0.12)
  }

  build() {
    const { r, o } = this
    const profile = o.profile ?? (() => 1)
    let x = -r.range(0, o.maxW)
    while (x < o.width) {
      const w = r.range(o.minW, o.maxW)
      const cx = x + w / 2
      const h = r.range(o.minH, o.maxH) * profile(Math.min(1, Math.max(0, cx / o.width)))
      const d = o.detail ?? {}
      if (r.chance(d.gothic ?? 0) && w < o.maxW * 0.8) {
        this.gothic(x, w, h)
      } else {
        const top = r.chance(d.setback ?? 0.3) ? this.setbacks(x, w, h, r.int(2, 4)) : this.plain(x, w, h)
        if (r.chance(d.water ?? 0.15)) this.waterTower(x + w * r.range(0.25, 0.75), top.top, r.range(0.8, 1.15))
        else if (r.chance(d.antenna ?? 0.15)) this.antenna(top.cx, top.top, r.range(14, 40))
        else if (r.chance(d.dome ?? 0)) this.dome(top.cx, top.top, top.w * 0.6)
      }
      x += w + r.range(-o.minW * 0.25, o.minW * 0.15)
    }
    for (const l of o.landmarks ?? []) {
      if (l.type === 'empire') this.empire(l)
      else if (l.type === 'chrysler') this.chrysler(l)
      else if (l.type === 'gothic') this.gothic(l.x - l.w / 2, l.w, l.h)
      else this.setbacks(l.x - l.w / 2, l.w, l.h, 4)
    }
    this.windows()
    return { body: this.body, warm: this.warm, pink: this.pink, beacons: this.beacons }
  }

  windows() {
    const win = this.o.windows
    if (!win) return
    const { r } = this
    for (const m of this.masses) {
      if (m.w < win.w * 3 || m.h < win.h * 3) continue
      const cols = Math.floor((m.w - win.gx) / (win.w + win.gx))
      const rows = Math.floor((m.h - win.gy) / (win.h + win.gy))
      const padX = (m.w - cols * (win.w + win.gx) + win.gx) / 2
      const mood = r.range(0.15, 1.7)
      const pinkBuilding = r.chance(win.pink)
      for (let row = 0; row < rows; row++) {
        const floorLit = r.chance(0.04)
        for (let col = 0; col < cols; col++) {
          if (!floorLit && !r.chance(win.density * mood)) continue
          const wx = m.x + padX + col * (win.w + win.gx)
          const wy = m.y + win.gy + row * (win.h + win.gy)
          const shape = rect(wx, wy, win.w, win.h)
          if (pinkBuilding ? r.chance(0.7) : r.chance(0.06)) this.pink += shape
          else this.warm += shape
        }
      }
    }
  }
}

export function buildSkyline(options: SkylineOptions): Skyline {
  return new Builder(rng(options.seed), options).build()
}
