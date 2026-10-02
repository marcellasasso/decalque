/**
 * Posição da imagem sobre o palco. `x` e `y` são frações da largura do palco,
 * para o alinhamento sobreviver a mudanças no tamanho da tela.
 */
export type OverlayTransform = {
  x: number
  y: number
  scale: number
  /** Graus. */
  rotation: number
}

/** Lente traseira: principal (1x) ou ultra-angular (0.5x). */
export type Lens = 'wide' | 'ultraWide'

export type Settings = {
  opacity: number
  transform: OverlayTransform
  flipped: boolean
  grayscale: boolean
  /** Pinça só redimensiona, sem girar. */
  rotationLocked: boolean
  locked: boolean
  lens: Lens
}
