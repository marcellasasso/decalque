import { useRef, useState } from 'react'
import styles from './App.module.css'
import { CameraMessage } from './components/CameraMessage'
import { CameraView } from './components/CameraView'
import { OverlayControls } from './components/OverlayControls'
import { OverlayImage } from './components/OverlayImage'
import { ShowControlsLayer } from './components/ShowControlsLayer'
import { Stage } from './components/Stage'
import { useCamera } from './hooks/useCamera'
import { useImageFile } from './hooks/useImageFile'
import { useOverlayGestures } from './hooks/useOverlayGestures'
import { usePersistedSettings } from './hooks/usePersistedSettings'
import { useSettings } from './hooks/useSettings'
import { useWakeLock } from './hooks/useWakeLock'

export default function App() {
  const { settings, actions } = useSettings()
  const settingsLoaded = usePersistedSettings(settings, actions.hydrate)
  const camera = useCamera({ lens: settings.lens, enabled: settingsLoaded })
  const image = useImageFile()
  const [controlsHidden, setControlsHidden] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useWakeLock()
  useOverlayGestures({
    targetRef: stageRef,
    transform: settings.transform,
    onChange: actions.updateTransform,
    enabled: Boolean(image.src) && !settings.locked,
    rotationLocked: settings.rotationLocked,
  })

  const pickImage = (file: File) => {
    image.setFile(file)
    actions.resetTransform()
  }

  return (
    <main className={styles.app}>
      <div className={styles.viewport}>
        <Stage ref={stageRef}>
          {camera.state.status === 'ready' ? (
            <CameraView stream={camera.state.stream} />
          ) : (
            <CameraMessage state={camera.state} />
          )}
          {image.src && (
            <OverlayImage
              src={image.src}
              opacity={settings.opacity}
              transform={settings.transform}
              flipped={settings.flipped}
              grayscale={settings.grayscale}
            />
          )}
        </Stage>
      </div>
      {controlsHidden ? (
        <ShowControlsLayer onShow={() => setControlsHidden(false)} />
      ) : (
        <OverlayControls
          settings={settings}
          actions={actions}
          hasImage={Boolean(image.src)}
          availableLenses={camera.availableLenses}
          onPickImage={pickImage}
          onHide={() => setControlsHidden(true)}
        />
      )}
    </main>
  )
}
