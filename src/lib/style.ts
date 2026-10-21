import type { CSSProperties } from 'react'

/** Atraso em cascata para elementos com `data-reveal` (unidade ≈ 90 ms). */
export const delay = (n: number) => ({ '--d': n }) as CSSProperties

/** Variáveis CSS arbitrárias com tipagem aceita pelo React. */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties
