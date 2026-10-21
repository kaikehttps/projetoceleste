import analysis from './audio-analysis.json'

/**
 * Gravações reais do portfólio. Os arquivos vêm de "TESTE DUBLAGEM/" e são
 * preparados por `npm run audio` (veja scripts/prepare-audio.mjs), que também
 * mede a duração e a intensidade de cada um a partir do próprio áudio.
 *
 * Títulos e capítulos são editáveis. Os capítulos marcam o momento em que cada
 * interação começa na gravação; os heróis foram conferidos nas falas originais
 * da Deadlock Wiki.
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
  if (!data) throw new Error(`Gravação "${id}" não encontrada em audio-analysis.json. Rode \`npm run audio\`.`)
  return { id, src: `${import.meta.env.BASE_URL}audio/${id}.m4a`, ...data, ...meta }
}

export const introTrack = track('apresentacao', {
  title: 'Me apresentando',
  subtitle: 'Por que escolhi a Urna e o Vendedor',
})

export const shopkeeperTrack = track('vendedor', {
  title: 'O Vendedor',
  subtitle: 'Falas de compra para diferentes heróis',
  chapters: [
    { at: 6.4, label: 'Abrams' },
    { at: 16.2, label: 'Yamato' },
    { at: 29.7, label: 'Dynamo' },
    { at: 35.6, label: 'Lash' },
    { at: 53.7, label: 'McGinnis' },
    { at: 61.7, label: 'Paradox' },
    { at: 73.1, label: 'Haze' },
  ],
})

export const urnTracks: Track[] = [
  track('urna-01', { title: 'O entregador chegou', subtitle: 'Ao ser coletada' }),
  track('urna-02', { title: 'Os espíritos estão se reunindo', subtitle: 'Contendo os espíritos' }),
  track('urna-03', { title: 'Estou esperando… olá?', subtitle: 'Esperando um entregador' }),
  track('urna-04', { title: 'Espíritos descontrolados', subtitle: 'Reunindo as almas' }),
  track('urna-05', { title: 'Você tem um plano, não tem?', subtitle: 'Um entregador sem rumo' }),
  track('urna-06', { title: 'Sou funcionário público!', subtitle: 'Sob fogo e na entrega' }),
  track('urna-07', {
    title: 'Interações com heróis',
    subtitle: 'Abrams, Drifter, Vyper, Mina e Celeste',
    chapters: [
      { at: 3.4, label: 'Abrams' },
      { at: 13.4, label: 'Drifter' },
      { at: 25.4, label: 'Vyper' },
      { at: 34.5, label: 'Mina' },
      { at: 49.4, label: 'Celeste' },
    ],
  }),
]

export const farewellTrack = track('despedida', {
  title: 'Me despedindo',
  subtitle: 'Uma última mensagem',
})

export const allTracks = [introTrack, shopkeeperTrack, ...urnTracks, farewellTrack]
export const characterTracks = [shopkeeperTrack, ...urnTracks]
