import { useEffect, type RefObject } from 'react'

/**
 * Escreve em `--sy` quantos pixels o elemento já subiu na tela, para as
 * camadas da cena se deslocarem em velocidades diferentes (via CSS).
 * Só trabalha enquanto o elemento está visível e respeita "reduzir movimento".
 */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let visible = true
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const y = Math.max(0, Math.min(r.height, -r.top))
      el.style.setProperty('--sy', y.toFixed(1))
    }
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}
