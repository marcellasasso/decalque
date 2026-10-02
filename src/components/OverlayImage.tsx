import styles from './OverlayImage.module.css'

type Props = {
  src: string
  opacity: number
}

export function OverlayImage({ src, opacity }: Props) {
  return <img className={styles.image} src={src} alt="" style={{ opacity }} draggable={false} />
}
