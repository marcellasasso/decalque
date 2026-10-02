import type { OverlaySettings } from '../types'
import { ControlBar } from './ControlBar'
import { IconButton } from './IconButton'
import { CenterIcon, FlipIcon, HideIcon, LockIcon, RotateIcon, UnlockIcon } from './icons'
import { ImagePickerButton } from './ImagePickerButton'
import { OpacitySlider } from './OpacitySlider'

type Props = {
  settings: OverlaySettings
  hasImage: boolean
  onPickImage: (file: File) => void
  onOpacityChange: (opacity: number) => void
  onToggleFlipped: () => void
  onResetTransform: () => void
  onToggleRotationLocked: () => void
  onToggleLocked: () => void
  onHide: () => void
}

/** Barra inferior. Travado, só a opacidade e o esconder continuam ativos. */
export function OverlayControls({
  settings,
  hasImage,
  onPickImage,
  onOpacityChange,
  onToggleFlipped,
  onResetTransform,
  onToggleRotationLocked,
  onToggleLocked,
  onHide,
}: Props) {
  const { locked } = settings
  const canAdjust = hasImage && !locked

  return (
    <ControlBar
      slider={<OpacitySlider value={settings.opacity} onChange={onOpacityChange} />}
      actions={
        <>
          <ImagePickerButton onPick={onPickImage} disabled={locked} />
          <IconButton
            icon={<FlipIcon />}
            label="Espelhar"
            onClick={onToggleFlipped}
            pressed={settings.flipped}
            disabled={!canAdjust}
          />
          <IconButton
            icon={<CenterIcon />}
            label="Centro"
            onClick={onResetTransform}
            disabled={!canAdjust}
          />
          <IconButton
            icon={<RotateIcon />}
            label="Sem giro"
            onClick={onToggleRotationLocked}
            pressed={settings.rotationLocked}
            disabled={!canAdjust}
          />
          <IconButton
            icon={locked ? <LockIcon /> : <UnlockIcon />}
            label={locked ? 'Travado' : 'Travar'}
            onClick={onToggleLocked}
            pressed={locked}
            disabled={!hasImage}
          />
          <IconButton icon={<HideIcon />} label="Esconder" onClick={onHide} />
        </>
      }
    />
  )
}
