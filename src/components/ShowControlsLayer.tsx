import styles from './ShowControlsLayer.module.css'

type Props = {
  onShow: () => void
}

/** Com os controles escondidos, um toque em qualquer lugar traz a barra de volta. */
export function ShowControlsLayer({ onShow }: Props) {
  return <button type="button" className={styles.layer} onClick={onShow} aria-label="Mostrar controles" />
}
