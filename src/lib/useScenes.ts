import { useEffect } from 'react'

/**
 * Observadores globais da página:
 * - `[data-reveal]` ganha `.is-revealed` ao entrar na tela (uma vez);
 * - `.scene` ganha `.is-offscreen` fora da tela, pausando suas animações.
 */
export function useScenes() {
  useEffect(() => {
    // O efeito "rise" começa recortado até altura zero (clip-path), e o
    // IntersectionObserver considera esse recorte: o elemento nunca "entraria"
    // na tela. Para esses, quem é observado é o elemento pai.
    const groups = new Map<Element, Element[]>()
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const target = el.dataset.reveal === 'rise' && el.parentElement ? el.parentElement : el
      groups.set(target, [...(groups.get(target) ?? []), el])
    })

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          groups.get(e.target)?.forEach((el) => el.classList.add('is-revealed'))
          reveal.unobserve(e.target)
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
    groups.forEach((_, target) => reveal.observe(target))
    document.querySelectorAll('.scene').forEach((el) => scenes.observe(el))
    return () => {
      reveal.disconnect()
      scenes.disconnect()
    }
  }, [])
}
