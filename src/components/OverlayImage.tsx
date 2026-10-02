import type { CSSProperties } from 'react'
import type { OverlayTransform } from '../types'
import styles from './OverlayImage.module.css'

type Props = {
  src: string
  opacity: number
  transform: OverlayTransform
  flipped: boolean
  grayscale: boolean
}

function toCssTransform({ x, y, scale, rotation }: OverlayTransform, flipped: boolean): string {
  // x/y são frações da largura do palco; o palco é um container, então 100cqw = largura dele.
  return [
    `translate(calc(${x} * 100cqw), calc(${y} * 100cqw))`,
    `rotate(${rotation}deg)`,
    `scale(${scale})`,
    flipped ? 'scaleX(-1)' : '',
  ].join(' ')
}

export function OverlayImage({ src, opacity, transform, flipped, grayscale }: Props) {
  const style: CSSProperties = {
    opacity,
    transform: toCssTransform(transform, flipped),
    filter: grayscale ? 'grayscale(1)' : undefined,
  }
  return <img className={styles.image} src={src} alt="" style={style} draggable={false} />
}
