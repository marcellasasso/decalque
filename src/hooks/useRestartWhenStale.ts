import { useEffect } from 'react'

/**
 * O iOS desliga a câmera quando o app vai para o segundo plano. Ao voltar,
 * se o vídeo morreu ou ficou mudo, pede para reabrir.
 */
export function useRestartWhenStale(stream: MediaStream | undefined, restart: () => void) {
  useEffect(() => {
    const track = stream?.getVideoTracks()[0]
    if (!track) return

    const restartIfStale = () => {
      if (document.visibilityState !== 'visible') return
      if (track.readyState === 'ended' || track.muted) restart()
    }

    document.addEventListener('visibilitychange', restartIfStale)
    track.addEventListener('ended', restartIfStale)
    return () => {
      document.removeEventListener('visibilitychange', restartIfStale)
      track.removeEventListener('ended', restartIfStale)
    }
  }, [stream, restart])
}
