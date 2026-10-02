import type { ReactNode } from 'react'
import styles from './ControlBar.module.css'

type Props = {
  children: ReactNode
}

export function ControlBar({ children }: Props) {
  return <div className={styles.bar}>{children}</div>
}
