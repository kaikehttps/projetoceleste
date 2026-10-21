import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer hospedagem estática,
  // inclusive em subpastas (GitHub Pages, Netlify, Vercel, itch.io…).
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
})
