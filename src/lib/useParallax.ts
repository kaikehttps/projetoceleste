import { useEffect, type RefObject } from 'react'

/** Camada que se desloca com a rolagem: `speed` px por px rolado; `fade` a apaga aos poucos. */
export type ParallaxLayer = { selector: string; speed: number; fade?: number }

/**
 * Desloca as camadas da cena em velocidades diferentes durante a rolagem.
 * Escreve `transform`/`opacity` direto em cada camada: a placa de vídeo só
 * reposiciona o que já está desenhado, sem recalcular nem repintar a cena.
 * Só trabalha enquanto a cena está visível e respeita "reduzir movimento".
 */
export function useParallax(ref: RefObject<HTMLElement | null>, layers: ParallaxLayer[]) {
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = layers.flatMap((l) => [...root.querySelectorAll<HTMLElement | SVGElement>(l.selector)].map((node) => ({ node, ...l })))
    let frame = 0
    let visible = true
    let lastY = -1
    const update = () => {
      frame = 0
      const r = root.getBoundingClientRect()
      // a rolagem é medida em pixels da tela; as camadas se movem em pixels do site (escala de 75% em telas grandes)
      const scale = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
      const y = Math.round(Math.max(0, Math.min(r.height, -r.top)) / scale)
      if (y === lastY) return
      lastY = y
      for (const n of nodes) {
        n.node.style.transform = y ? `translate3d(0, ${(y * n.speed).toFixed(1)}px, 0)` : ''
        if (n.fade) n.node.style.opacity = y ? String(Math.max(0, 1 - y / n.fade)) : ''
      }
    }
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    })
    io.observe(root)
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref, layers])
}
