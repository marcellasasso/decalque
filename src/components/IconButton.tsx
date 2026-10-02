import type { ReactNode } from 'react'
import styles from './IconButton.module.css'

type Props = {
  icon: ReactNode
  label: string
  onClick: () => void
  /** Botões de liga/desliga: expõe o estado e destaca quando ativo. */
  pressed?: boolean
  disabled?: boolean
}

export function IconButton({ icon, label, onClick, pressed, disabled }: Props) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-pressed={pressed}
      disabled={disabled}
    >
      {icon}
      <span className={styles.label}>{label}</span>
    </button>
  )
}
