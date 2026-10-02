import type { ChangeEvent } from 'react'
import styles from './ImagePickerButton.module.css'

type Props = {
  onPick: (file: File) => void
}

export function ImagePickerButton({ onPick }: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onPick(file)
    // Permite escolher o mesmo arquivo de novo.
    event.target.value = ''
  }

  return (
    <label className={styles.button}>
      <input className={styles.input} type="file" accept="image/*" onChange={handleChange} />
      Escolher imagem
    </label>
  )
}
