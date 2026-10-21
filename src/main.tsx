import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource-variable/big-shoulders-display'

import './styles/tokens.css'
import './styles/base.css'

import { App } from './App'
import './styles/fit.css'

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
