import { useEffect, useRef } from 'react'
import styles from './CameraView.module.css'

type Props = {
  stream: MediaStream
}

export function CameraView({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // iOS só reproduz automaticamente vídeo mudo e inline.
    video.muted = true
    video.srcObject = stream
    video.play().catch(() => {
      // Sem gesto do usuário o play pode falhar; o autoPlay tenta de novo.
    })
    return () => {
      video.srcObject = null
    }
  }, [stream])

  return <video ref={videoRef} className={styles.video} autoPlay muted playsInline />
}
