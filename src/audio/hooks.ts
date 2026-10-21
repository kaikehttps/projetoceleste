import { useEffect, useSyncExternalStore, type RefObject } from 'react'
import { director } from './director'

export function useDirectorState() {
  return useSyncExternalStore(director.subscribe, director.getState, director.getState)
}

/** O player (ou algum dos players) indicado está tocando agora? */
export function useIsPlaying(ids: string[]) {
  const { activeId, playing } = useDirectorState()
  return playing && activeId !== null && ids.includes(activeId)
}

/**
 * Faz camadas de luz (`selector`) reagirem à voz dos players indicados,
 * mudando só a opacidade delas — a placa de vídeo resolve sem repintar a cena.
 * (Uma variável CSS no elemento da seção obrigaria o navegador a recalcular
 * milhares de elementos dos desenhos a cada quadro.)
 */
export function useVoiceGlow(ref: RefObject<HTMLElement | null>, ids: string[], selector: string, min = 0, max = 1) {
  const key = ids.join('|')
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const own = key.split('|')
    const glows = [...root.querySelectorAll<HTMLElement>(selector)]
    let last = ''
    return director.onLevel((activeId, level) => {
      const v = (min + (max - min) * (activeId && own.includes(activeId) ? level : 0)).toFixed(3)
      if (v === last) return
      last = v
      for (const g of glows) g.style.opacity = v
    })
  }, [ref, key, selector, min, max])
}
