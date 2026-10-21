/**
 * Prepara as gravações originais de "TESTE DUBLAGEM/" para a web:
 *
 *  1. Copia cada arquivo para public/audio/ com um nome limpo para URL.
 *     O arquivo é remuxado com `-c copy -movflags +faststart`: o áudio fica
 *     idêntico (sem recodificação), só o índice do MP4 vai para o início,
 *     o que permite ao navegador ler a duração sem baixar o arquivo todo.
 *  2. Decodifica o áudio e gera src/data/audio-analysis.json com:
 *     - duration: duração real informada pelo contêiner;
 *     - peaks: 240 amostras de intensidade (desenho da waveform);
 *     - envelope: intensidade a 20 Hz (iluminação reativa das cenas).
 *
 * Requer ffmpeg. Use a variável FFMPEG_PATH ou tenha `ffmpeg` no PATH:
 *   FFMPEG_PATH=/caminho/ffmpeg npm run audio
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(ROOT, 'TESTE DUBLAGEM')
const OUT_DIR = join(ROOT, 'public', 'audio')
const DATA_FILE = join(ROOT, 'src', 'data', 'audio-analysis.json')
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg'

// Arquivo original → nome publicado. A identificação foi conferida ouvindo
// (transcrevendo) o conteúdo de cada gravação, não só pelo nome do arquivo.
// "Recording (2).m4a" ficou de fora: contém apenas um "Oi!" de teste.
const FILES = {
  'MEAPRESENTANDO.m4a': 'apresentacao.m4a',
  'vendedor.m4a': 'vendedor.m4a',
  'Recording (5).m4a': 'urna-01.m4a',
  'Recording (6).m4a': 'urna-02.m4a',
  'Recording (7).m4a': 'urna-03.m4a',
  'Recording (8).m4a': 'urna-04.m4a',
  'Recording (9).m4a': 'urna-05.m4a',
  'Recording (10).m4a': 'urna-06.m4a',
  'Recording (11).m4a': 'urna-07.m4a',
  'MEDESPEDINDO.m4a': 'despedida.m4a',
}

const PEAK_COUNT = 240
const ENVELOPE_HZ = 20
const SAMPLE_RATE = 8000

function run(args, opts = {}) {
  const r = spawnSync(FFMPEG, args, { maxBuffer: 1 << 30, ...opts })
  if (r.error) {
    console.error(`Não foi possível executar o ffmpeg (${FFMPEG}). Defina FFMPEG_PATH.`)
    process.exit(1)
  }
  return r
}

function containerDuration(file) {
  const info = run(['-hide_banner', '-i', file]).stderr.toString()
  const m = info.match(/Duration: (\d+):(\d+):([\d.]+)/)
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null
}

function decode(file) {
  const r = run(['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE), '-'])
  const buf = r.stdout
  return new Int16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2)
}

function rmsBuckets(samples, count) {
  const out = new Float64Array(count)
  const size = samples.length / count
  for (let i = 0; i < count; i++) {
    const a = Math.floor(i * size)
    const b = Math.max(a + 1, Math.floor((i + 1) * size))
    let sum = 0
    for (let j = a; j < b && j < samples.length; j++) sum += samples[j] * samples[j]
    out[i] = Math.sqrt(sum / (b - a))
  }
  return out
}

// Normaliza 0–100 com curva suave (voz tem faixa dinâmica grande).
function normalize(values, curve = 0.6) {
  const sorted = [...values].sort((a, b) => a - b)
  const ref = sorted[Math.floor(sorted.length * 0.985)] || 1
  return Array.from(values, (v) => Math.round(Math.min(1, v / ref) ** curve * 100))
}

mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(dirname(DATA_FILE), { recursive: true })

const analysis = {}
for (const [source, target] of Object.entries(FILES)) {
  const src = join(SRC_DIR, source)
  const dest = join(OUT_DIR, target)
  if (!existsSync(src)) {
    console.warn(`! Arquivo não encontrado: ${source}`)
    continue
  }
  const remux = run(['-v', 'error', '-y', '-i', src, '-map', '0:a', '-c', 'copy', '-movflags', '+faststart', dest])
  if (remux.status !== 0) copyFileSync(src, dest)

  const slug = target.replace(/\.m4a$/, '')
  const samples = decode(dest)
  const duration = containerDuration(dest) ?? samples.length / SAMPLE_RATE
  analysis[slug] = {
    source,
    duration: Math.round(duration * 1000) / 1000,
    peaks: normalize(rmsBuckets(samples, PEAK_COUNT)),
    envelope: normalize(rmsBuckets(samples, Math.ceil(duration * ENVELOPE_HZ)), 0.8),
  }
  console.log(`✓ ${source} → audio/${target} (${duration.toFixed(2)} s)`)
}

writeFileSync(DATA_FILE, JSON.stringify({ envelopeHz: ENVELOPE_HZ, tracks: analysis }) + '\n')
console.log(`Análise salva em ${DATA_FILE}`)
