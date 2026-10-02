import type { Lens } from '../types'
import { IconButton } from './IconButton'
import { CameraIcon } from './icons'

const LENS_LABEL: Record<Lens, string> = { wide: '1x', ultraWide: '0.5x' }

type Props = {
  lens: Lens
  available: Lens[]
  onChange: (lens: Lens) => void
  disabled?: boolean
}

/** Alterna entre as lentes traseiras encontradas. Com uma só, fica desativado. */
export function LensButton({ lens, available, onChange, disabled }: Props) {
  const next = available[(available.indexOf(lens) + 1) % available.length]

  return (
    <IconButton
      icon={<CameraIcon />}
      label={`Lente ${LENS_LABEL[lens]}`}
      onClick={() => next && onChange(next)}
      disabled={disabled || available.length < 2}
    />
  )
}
