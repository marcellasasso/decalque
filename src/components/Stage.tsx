import type { ReactNode, Ref } from 'react'
import styles from './Stage.module.css'

type Props = {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
}

/** Área 3:4 onde câmera e imagem se sobrepõem, com as mesmas coordenadas. */
export function Stage({ children, ref }: Props) {
  return (
    <div ref={ref} className={styles.stage}>
      {children}
    </div>
  )
}
