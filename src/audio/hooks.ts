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
 * Escreve o nível da voz (0–1) na variável CSS `--level` do elemento,
 * sem re-renderizar o React. Só reage aos players indicados.
 */
export function useSceneLevel(ref: RefObject<HTMLElement | null>, ids: string[]) {
  const key = ids.join('|')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const own = key.split('|')
    let last = -1
    return director.onLevel((activeId, level) => {
      const v = activeId && own.includes(activeId) ? Math.round(level * 1000) / 1000 : 0
      if (v !== last) {
        el.style.setProperty('--level', String(v))
        last = v
      }
    })
  }, [ref, key])
}
