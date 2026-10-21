import fogA from '../../assets/textures/fog-a.webp'
import fogB from '../../assets/textures/fog-b.webp'
import type { CSSProperties } from 'react'
import './Fog.css'

type Props = {
  variant?: 'a' | 'b'
  className?: string
  /** Segundos para uma volta completa da deriva. */
  speed?: number
  reverse?: boolean
}

/**
 * Névoa que deriva lentamente. A textura é contínua no eixo X e funciona
 * como máscara, então a cor vem do tema (--fog). Só usa transform: barata.
 */
export function Fog({ variant = 'a', className = '', speed = 140, reverse = false }: Props) {
  const style = {
    '--fog-img': `url(${variant === 'a' ? fogA : fogB})`,
    '--fog-speed': `${speed}s`,
    '--fog-dir': reverse ? 'reverse' : 'normal',
  } as CSSProperties
  return (
    <div className={`fog ${className}`} style={style} aria-hidden="true">
      <div className="fog__drift" />
    </div>
  )
}
