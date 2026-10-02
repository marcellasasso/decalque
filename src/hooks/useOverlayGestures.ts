import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'
import { useEffect, useRef, type RefObject } from 'react'
import type { OverlayTransform } from '../types'

const useGesture = createUseGesture([dragAction, pinchAction])

const SCALE_BOUNDS = { min: 0.1, max: 8 }

type Options = {
  targetRef: RefObject<HTMLElement | null>
  transform: OverlayTransform
  onChange: (patch: Partial<OverlayTransform>) => void
  enabled: boolean
}

/** Arrastar com um dedo move; pinça redimensiona e gira. Ouve o palco inteiro. */
export function useOverlayGestures({ targetRef, transform, onChange, enabled }: Options) {
  // Os gestos leem o valor atual só quando começam.
  const transformRef = useRef(transform)
  useEffect(() => {
    transformRef.current = transform
  }, [transform])

  useEffect(() => {
    // Impede o zoom de página do Safari/WebKit de competir com a pinça.
    const prevent = (event: Event) => event.preventDefault()
    document.addEventListener('gesturestart', prevent)
    document.addEventListener('gesturechange', prevent)
    return () => {
      document.removeEventListener('gesturestart', prevent)
      document.removeEventListener('gesturechange', prevent)
    }
  }, [])

  const stageWidth = () => targetRef.current?.clientWidth || 1

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) {
          cancel()
          return
        }
        const width = stageWidth()
        onChange({ x: x / width, y: y / width })
      },
      onPinch: ({ offset: [scale, rotation] }) => onChange({ scale, rotation }),
    },
    {
      target: targetRef,
      enabled,
      eventOptions: { passive: false },
      drag: {
        from: () => {
          const width = stageWidth()
          return [transformRef.current.x * width, transformRef.current.y * width]
        },
      },
      pinch: {
        from: () => [transformRef.current.scale, transformRef.current.rotation],
        scaleBounds: SCALE_BOUNDS,
      },
    },
  )
}
