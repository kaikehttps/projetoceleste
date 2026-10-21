import { Fragment } from 'react'
import { Star4 } from './art/Star4'
import './Marquee.css'

/** Faixa de letreiro que corre devagar, como a marquise de um cinema antigo. */
export function Marquee({ items }: { items: string[] }) {
  const row = () => (
    <div className="marquee__row">
      {items.map((t, i) => (
        <Fragment key={i}>
          <span>{t}</span>
          <Star4 />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className="marquee scene" aria-hidden="true">
      <div className="marquee__track">
        {row()}
        {row()}
      </div>
    </div>
  )
}
