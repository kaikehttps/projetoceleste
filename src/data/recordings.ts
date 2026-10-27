import analysis from './audio-analysis.json'

/**
 * Áudios do site: as falas originais do próprio jogo (Deadlock, © Valve) do
 * Vendedor e da Urna. Os arquivos vêm de "TESTE DUBLAGEM/" e são preparados
 * por `npm run audio` (veja scripts/prepare-audio.mjs), que também mede a
 * duração e a intensidade de cada um a partir do próprio áudio.
 *
 * Títulos e capítulos são editáveis. Cada capítulo marca o início de uma fala:
 * os do Vendedor pelo herói a quem ele se dirige (o nome aparece na fala), os
 * da Urna pela situação.
 */

export type Chapter = { at: number; label: string }

export type Track = {
  id: string
  src: string
  title: string
  subtitle?: string
  /** Arquivo original, só para referência. */
  source: string
  duration: number
  peaks: number[]
  envelope: number[]
  chapters?: Chapter[]
}

type TrackMeta = Pick<Track, 'title' | 'subtitle' | 'chapters'>

export const ENVELOPE_HZ: number = analysis.envelopeHz

const tracks = analysis.tracks as Record<
  string,
  { source: string; duration: number; peaks: number[]; envelope: number[] }
>

function track(id: string, meta: TrackMeta): Track {
  const data = tracks[id]
  if (!data) throw new Error(`Áudio "${id}" não encontrado em audio-analysis.json. Rode \`npm run audio\`.`)
  return { id, src: `${import.meta.env.BASE_URL}audio/${id}.m4a`, ...data, ...meta }
}

export const shopkeeperTrack = track('vendedor', {
  title: 'O Vendedor',
  subtitle: 'Falas dirigidas a cada herói',
  chapters: [
    { at: 21.5, label: 'Abrams' },
    { at: 32.5, label: 'Bebop' },
    { at: 47.3, label: 'Dynamo' },
    { at: 62.2, label: 'Grey Talon' },
    { at: 75.5, label: 'Haze' },
    { at: 97.8, label: 'Infernus' },
    { at: 112.3, label: 'Ivy' },
    { at: 163.3, label: 'Lash' },
    { at: 179.7, label: 'McGinnis' },
    { at: 197.2, label: 'Mo & Krill' },
    { at: 213.7, label: 'Paradox' },
    { at: 271.5, label: 'Shiv' },
    { at: 293.8, label: 'Vindicta' },
    { at: 312, label: 'Viscous' },
    { at: 367.9, label: 'Yamato' },
  ],
})

export const urnTrack = track('urna', {
  title: 'A Urna Espiritual',
  subtitle: 'Coleta, espera, entrega e imprevistos',
  chapters: [
    { at: 5.8, label: 'Reunindo almas' },
    { at: 37.4, label: 'Esperando' },
    { at: 139.4, label: 'Coletada' },
    { at: 154, label: 'A caminho' },
    { at: 172.1, label: 'Sob fogo' },
    { at: 193.1, label: 'Largada no chão' },
    { at: 217.6, label: 'Sem rumo' },
    { at: 236.2, label: 'Entrega feita' },
  ],
})

export const allTracks = [shopkeeperTrack, urnTrack]
