import { useCallback, useEffect, useState } from 'react'

/** Mantém a imagem escolhida como object URL, liberando a anterior. */
export function useImageFile() {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!src) return
    return () => URL.revokeObjectURL(src)
  }, [src])

  const setFile = useCallback((file: File) => {
    setSrc(URL.createObjectURL(file))
  }, [])

  return { src, setFile }
}
