import { useCallback, useMemo, useReducer } from 'react'
import type { Lens, OverlayTransform, Settings } from '../types'

const INITIAL_TRANSFORM: OverlayTransform = { x: 0, y: 0, scale: 1, rotation: 0 }

const INITIAL_SETTINGS: Settings = {
  opacity: 0.5,
  transform: INITIAL_TRANSFORM,
  flipped: false,
  grayscale: false,
  rotationLocked: false,
  locked: false,
  lens: 'wide',
}

type Toggle = 'flipped' | 'grayscale' | 'rotationLocked' | 'locked'

type Action =
  | { type: 'hydrate'; saved: Partial<Settings> }
  | { type: 'setOpacity'; opacity: number }
  | { type: 'updateTransform'; patch: Partial<OverlayTransform> }
  | { type: 'resetTransform' }
  | { type: 'toggle'; key: Toggle }
  | { type: 'setLens'; lens: Lens }

function reducer(state: Settings, action: Action): Settings {
  switch (action.type) {
    case 'hydrate':
      // Mescla com os padrões: ajustes salvos por versões antigas podem não ter campos novos.
      return {
        ...INITIAL_SETTINGS,
        ...action.saved,
        transform: { ...INITIAL_TRANSFORM, ...action.saved.transform },
      }
    case 'setOpacity':
      return { ...state, opacity: action.opacity }
    case 'updateTransform':
      return { ...state, transform: { ...state.transform, ...action.patch } }
    case 'resetTransform':
      return { ...state, transform: INITIAL_TRANSFORM, flipped: false }
    case 'toggle':
      return { ...state, [action.key]: !state[action.key] }
    case 'setLens':
      return { ...state, lens: action.lens }
  }
}

export function useSettings() {
  const [settings, dispatch] = useReducer(reducer, INITIAL_SETTINGS)

  const hydrate = useCallback((saved: Partial<Settings>) => dispatch({ type: 'hydrate', saved }), [])
  const updateTransform = useCallback(
    (patch: Partial<OverlayTransform>) => dispatch({ type: 'updateTransform', patch }),
    [],
  )

  const actions = useMemo(
    () => ({
      hydrate,
      updateTransform,
      setOpacity: (opacity: number) => dispatch({ type: 'setOpacity', opacity }),
      resetTransform: () => dispatch({ type: 'resetTransform' }),
      toggle: (key: Toggle) => dispatch({ type: 'toggle', key }),
      setLens: (lens: Lens) => dispatch({ type: 'setLens', lens }),
    }),
    [hydrate, updateTransform],
  )

  return { settings, actions }
}

export type SettingsActions = ReturnType<typeof useSettings>['actions']
