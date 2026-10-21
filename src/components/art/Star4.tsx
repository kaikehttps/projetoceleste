/** Estrela de quatro pontas côncavas — o brilho celestial da logo do Projeto Celeste. */
export const STAR4_PATH =
  'M12 0C12.9 7.1 16.9 11.1 24 12C16.9 12.9 12.9 16.9 12 24C11.1 16.9 7.1 12.9 0 12C7.1 11.1 11.1 7.1 12 0Z'

export function Star4({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg
      className={`star4 ${className}`}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={STAR4_PATH} />
    </svg>
  )
}

export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span className="dot" />
      <Star4 />
      <span className="dot" />
    </div>
  )
}
