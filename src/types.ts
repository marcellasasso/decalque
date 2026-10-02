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

export type OverlaySettings = {
  opacity: number
  transform: OverlayTransform
  flipped: boolean
  locked: boolean
}
