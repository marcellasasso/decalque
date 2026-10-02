import { useRef, type ChangeEvent } from 'react'
import { IconButton } from './IconButton'
import { ImageIcon } from './icons'

type Props = {
  onPick: (file: File) => void
  disabled?: boolean
}

export function ImagePickerButton({ onPick, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onPick(file)
    // Permite escolher o mesmo arquivo de novo.
    event.target.value = ''
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <IconButton
        icon={<ImageIcon />}
        label="Imagem"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      />
    </>
  )
}
