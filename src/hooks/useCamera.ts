import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  findLensDevices,
  isCameraSupported,
  openStream,
  stopStream,
  streamDeviceId,
  type LensDevices,
} from '../lib/camera'
import type { Lens } from '../types'
import { useRestartWhenStale } from './useRestartWhenStale'

export type CameraState =
  | { status: 'loading' }
  | { status: 'ready'; stream: MediaStream }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'error'; message: string }

const LENS_ORDER: Lens[] = ['wide', 'ultraWide']

function toErrorState(error: unknown): CameraState {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return { status: 'denied' }
  }
  const message = error instanceof Error ? error.message : String(error)
  return { status: 'error', message }
}

type Options = {
  lens: Lens
  /** Espera os ajustes salvos carregarem, para já abrir na lente certa. */
  enabled: boolean
}

/** Abre a câmera traseira na lente pedida e a reabre quando o iOS a derruba. */
export function useCamera({ lens, enabled }: Options) {
  const [state, setState] = useState<CameraState>(() =>
    isCameraSupported() ? { status: 'loading' } : { status: 'unsupported' },
  )
  const [lensDevices, setLensDevices] = useState<LensDevices>({})
  const lensDevicesRef = useRef<LensDevices>({})
  const [restartKey, setRestartKey] = useState(0)

  useEffect(() => {
    if (!enabled || !isCameraSupported()) return

    let cancelled = false
    let stream: MediaStream | undefined

    // Um stream que chega depois do cancelamento também precisa ser encerrado.
    const isStale = () => {
      if (cancelled) stopStream(stream)
      return cancelled
    }

    async function start() {
      stream = await openStream(lensDevicesRef.current[lens])
      if (isStale()) return

      // Os nomes das lentes só aparecem depois da permissão, então descobre na primeira abertura.
      if (!lensDevicesRef.current.wide) {
        const found = await findLensDevices()
        if (isStale()) return
        lensDevicesRef.current = found
        setLensDevices(found)

        const wanted = found[lens]
        if (wanted && streamDeviceId(stream) !== wanted) {
          stopStream(stream)
          stream = await openStream(wanted)
          if (isStale()) return
        }
      }

      setState({ status: 'ready', stream })
    }

    start().catch((error: unknown) => {
      if (!cancelled) setState(toErrorState(error))
    })

    return () => {
      cancelled = true
      stopStream(stream)
    }
  }, [enabled, lens, restartKey])

  const restart = useCallback(() => setRestartKey((key) => key + 1), [])
  useRestartWhenStale(state.status === 'ready' ? state.stream : undefined, restart)

  const availableLenses = useMemo(
    () => LENS_ORDER.filter((candidate) => lensDevices[candidate]),
    [lensDevices],
  )

  return { state, availableLenses }
}
