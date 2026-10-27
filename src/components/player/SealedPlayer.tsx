import { Fragment } from 'react'
import { Star4 } from '../art/Star4'
import './SealedPlayer.css'

type Props = {
  /** Rótulo do player apagado, como era o do original. */
  label: string
  /** `paper`: sobre a ficha de papel; `dark`: sobre o fundo escuro. */
  tone?: 'paper' | 'dark'
}

const WORDS = ['Arquivo encerrado', 'Não entre', 'Fora do ar', 'Não entre']

/** Uma fita contínua: as frases se repetem até passar da largura do player. */
function Tape() {
  return (
    <span className="sealed__run">
      {[0, 1, 2].map((r) => (
        <Fragment key={r}>
          {WORDS.map((w, i) => (
            <Fragment key={i}>
              <span>{w}</span>
              <Star4 />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </span>
  )
}

/**
 * Player "fora do ar": parece o player de antes, mas é só um desenho — não tem
 * áudio, nem botão, nem nada que possa receber clique ou foco. Duas fitas de
 * isolamento cruzam por cima. Não finge ser uma gravação que funciona: é a
 * lembrança de uma que já foi retirada.
 */
export function SealedPlayer({ label, tone = 'paper' }: Props) {
  return (
    <div
      className={`sealed sealed--${tone}`}
      role="img"
      aria-label={`${label}: gravação indisponível. Arquivo encerrado.`}
    >
      <div className="sealed__ghost" aria-hidden="true">
        <div className="sealed__head">
          <span>{label}</span>
          <span>— Fora do ar</span>
        </div>
        <div className="sealed__main">
          <span className="sealed__btn" />
          <div className="sealed__body">
            <span className="sealed__title" />
            <span className="sealed__line" />
            <div className="sealed__times">
              <span>--:--</span>
              <span>--:--</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sealed__tape sealed__tape--a" aria-hidden="true">
        <Tape />
      </div>
      <div className="sealed__tape sealed__tape--b" aria-hidden="true">
        <Tape />
      </div>
    </div>
  )
}
