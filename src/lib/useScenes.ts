import { useEffect } from 'react'

/**
 * Observadores globais da página:
 * - `[data-reveal]` ganha `.is-revealed` ao entrar na tela (uma vez);
 * - `.scene` ganha `.is-offscreen` fora da tela, pausando suas animações.
 */
export function useScenes() {
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            reveal.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const scenes = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('is-offscreen', !e.isIntersecting)
      },
      { rootMargin: '120px 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el))
    document.querySelectorAll('.scene').forEach((el) => scenes.observe(el))
    return () => {
      reveal.disconnect()
      scenes.disconnect()
    }
  }, [])
}
