import { useEffect } from 'react'

/** Mantém a tela acesa. O sistema solta a trava ao sair do app, então pede de novo ao voltar. */
export function useWakeLock() {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | undefined
    let active = true

    const request = () => {
      if (document.visibilityState !== 'visible') return
      navigator.wakeLock
        .request('screen')
        .then((lock) => {
          if (active) sentinel = lock
          else lock.release().catch(() => {})
        })
        .catch(() => {
          // Sem suporte ou negado (ex.: modo economia de energia): segue sem trava.
        })
    }

    request()
    document.addEventListener('visibilitychange', request)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', request)
      sentinel?.release().catch(() => {})
    }
  }, [])
}
