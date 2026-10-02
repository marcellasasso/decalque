import { useEffect, useState } from 'react'
import { getItem, setItem } from '../lib/storage'
import type { Settings } from '../types'

const KEY = 'settings'
const SAVE_DELAY_MS = 300

/**
 * Restaura os ajustes salvos ao abrir e salva a cada mudança (com um pequeno atraso,
 * para não gravar a cada quadro de um gesto). Retorna `true` quando já carregou.
 */
export function usePersistedSettings(
  settings: Settings,
  hydrate: (saved: Partial<Settings>) => void,
): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    getItem<Partial<Settings>>(KEY)
      .then((saved) => {
        if (!cancelled && saved) hydrate(saved)
      })
      .catch(() => {
        // Sem armazenamento disponível: segue com os padrões.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [hydrate])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => {
      setItem(KEY, settings).catch(() => {})
    }, SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [settings, loaded])

  return loaded
}
