import { useCallback, useEffect, useState } from 'react'
import { getItem, setItem } from '../lib/storage'

const KEY = 'image'

/** Imagem sobreposta: restaura a última ao abrir e guarda cada nova escolhida. */
export function useImageFile() {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getItem<Blob>(KEY)
      .then((blob) => {
        // Só restaura se nenhuma imagem foi escolhida enquanto carregava.
        if (!cancelled && blob) setSrc((current) => current ?? URL.createObjectURL(blob))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!src) return
    return () => URL.revokeObjectURL(src)
  }, [src])

  const setFile = useCallback((file: File) => {
    setSrc(URL.createObjectURL(file))
    setItem(KEY, file).catch(() => {})
  }, [])

  return { src, setFile }
}
