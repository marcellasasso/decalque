import { useCallback, useMemo, useReducer } from 'react'
import type { OverlaySettings, OverlayTransform } from '../types'

const INITIAL_TRANSFORM: OverlayTransform = { x: 0, y: 0, scale: 1, rotation: 0 }

const INITIAL_SETTINGS: OverlaySettings = {
  opacity: 0.5,
  transform: INITIAL_TRANSFORM,
  flipped: false,
  rotationLocked: false,
  locked: false,
}

type Action =
  | { type: 'setOpacity'; opacity: number }
  | { type: 'updateTransform'; patch: Partial<OverlayTransform> }
  | { type: 'resetTransform' }
  | { type: 'toggleFlipped' }
  | { type: 'toggleRotationLocked' }
  | { type: 'toggleLocked' }

function reducer(state: OverlaySettings, action: Action): OverlaySettings {
  switch (action.type) {
    case 'setOpacity':
      return { ...state, opacity: action.opacity }
    case 'updateTransform':
      return { ...state, transform: { ...state.transform, ...action.patch } }
    case 'resetTransform':
      return { ...state, transform: INITIAL_TRANSFORM, flipped: false }
    case 'toggleFlipped':
      return { ...state, flipped: !state.flipped }
    case 'toggleRotationLocked':
      return { ...state, rotationLocked: !state.rotationLocked }
    case 'toggleLocked':
      return { ...state, locked: !state.locked }
  }
}

export function useOverlaySettings() {
  const [settings, dispatch] = useReducer(reducer, INITIAL_SETTINGS)

  const setOpacity = useCallback((opacity: number) => dispatch({ type: 'setOpacity', opacity }), [])
  const updateTransform = useCallback(
    (patch: Partial<OverlayTransform>) => dispatch({ type: 'updateTransform', patch }),
    [],
  )

  const actions = useMemo(
    () => ({
      setOpacity,
      updateTransform,
      resetTransform: () => dispatch({ type: 'resetTransform' }),
      toggleFlipped: () => dispatch({ type: 'toggleFlipped' }),
      toggleRotationLocked: () => dispatch({ type: 'toggleRotationLocked' }),
      toggleLocked: () => dispatch({ type: 'toggleLocked' }),
    }),
    [setOpacity, updateTransform],
  )

  return { settings, actions }
}
