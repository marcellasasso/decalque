import type { ReactNode } from 'react'
import styles from './Stage.module.css'

type Props = {
  children: ReactNode
}

/** Área 3:4 onde câmera e imagem se sobrepõem, com as mesmas coordenadas. */
export function Stage({ children }: Props) {
  return <div className={styles.stage}>{children}</div>
}
