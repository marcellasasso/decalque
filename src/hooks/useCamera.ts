import { useEffect, useState } from 'react'

export type CameraState =
  | { status: 'loading' }
  | { status: 'ready'; stream: MediaStream }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'error'; message: string }

const CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1920 },
    height: { ideal: 1440 },
  },
}

// Fora de HTTPS o navegador não expõe navigator.mediaDevices.
function isCameraSupported(): boolean {
  return 'mediaDevices' in navigator && typeof navigator.mediaDevices.getUserMedia === 'function'
}

function toErrorState(error: unknown): CameraState {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return { status: 'denied' }
  }
  const message = error instanceof Error ? error.message : String(error)
  return { status: 'error', message }
}

/** Abre a câmera traseira e encerra o stream ao desmontar. */
export function useCamera(): CameraState {
  const [state, setState] = useState<CameraState>(() =>
    isCameraSupported() ? { status: 'loading' } : { status: 'unsupported' },
  )

  useEffect(() => {
    if (!isCameraSupported()) return

    let cancelled = false
    let stream: MediaStream | undefined

    navigator.mediaDevices
      .getUserMedia(CONSTRAINTS)
      .then((s) => {
        stream = s
        if (cancelled) {
          s.getTracks().forEach((track) => track.stop())
          return
        }
        setState({ status: 'ready', stream: s })
      })
      .catch((error: unknown) => {
        if (!cancelled) setState(toErrorState(error))
      })

    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return state
}
