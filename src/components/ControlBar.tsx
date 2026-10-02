import type { ReactNode } from 'react'
import styles from './ControlBar.module.css'

type Props = {
  /** Linha de cima: o slider de opacidade. */
  slider: ReactNode
  /** Linha de baixo: os botões. */
  actions: ReactNode
}

export function ControlBar({ slider, actions }: Props) {
  return (
    <div className={styles.bar}>
      {slider}
      <div className={styles.actions}>{actions}</div>
    </div>
  )
}
