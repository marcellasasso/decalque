import type { SettingsActions } from '../hooks/useSettings'
import type { Lens, Settings } from '../types'
import { ControlBar } from './ControlBar'
import { IconButton } from './IconButton'
import {
  CenterIcon,
  FlipIcon,
  GrayscaleIcon,
  HideIcon,
  LockIcon,
  RotateIcon,
  UnlockIcon,
} from './icons'
import { ImagePickerButton } from './ImagePickerButton'
import { LensButton } from './LensButton'
import { OpacitySlider } from './OpacitySlider'

type Props = {
  settings: Settings
  actions: SettingsActions
  hasImage: boolean
  availableLenses: Lens[]
  onPickImage: (file: File) => void
  onHide: () => void
}

/**
 * Barra inferior. Travado, fica bloqueado só o que mexe no alinhamento
 * (imagem, lente, espelhar, centro, giro); opacidade e P&B continuam livres.
 */
export function OverlayControls({
  settings,
  actions,
  hasImage,
  availableLenses,
  onPickImage,
  onHide,
}: Props) {
  const { locked } = settings
  const canAdjust = hasImage && !locked

  return (
    <ControlBar
      slider={<OpacitySlider value={settings.opacity} onChange={actions.setOpacity} />}
      actions={
        <>
          <ImagePickerButton onPick={onPickImage} disabled={locked} />
          <IconButton
            icon={<GrayscaleIcon />}
            label="P&B"
            onClick={() => actions.toggle('grayscale')}
            pressed={settings.grayscale}
            disabled={!hasImage}
          />
          <IconButton
            icon={<FlipIcon />}
            label="Espelhar"
            onClick={() => actions.toggle('flipped')}
            pressed={settings.flipped}
            disabled={!canAdjust}
          />
          <LensButton
            lens={settings.lens}
            available={availableLenses}
            onChange={actions.setLens}
            disabled={locked}
          />
          <IconButton
            icon={<CenterIcon />}
            label="Centro"
            onClick={actions.resetTransform}
            disabled={!canAdjust}
          />
          <IconButton
            icon={<RotateIcon />}
            label="Sem giro"
            onClick={() => actions.toggle('rotationLocked')}
            pressed={settings.rotationLocked}
            disabled={!canAdjust}
          />
          <IconButton
            icon={locked ? <LockIcon /> : <UnlockIcon />}
            label={locked ? 'Travado' : 'Travar'}
            onClick={() => actions.toggle('locked')}
            pressed={locked}
            disabled={!hasImage}
          />
          <IconButton icon={<HideIcon />} label="Esconder" onClick={onHide} />
        </>
      }
    />
  )
}
