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
import { useOverlaySettings } from './hooks/useOverlaySettings'

export default function App() {
  const camera = useCamera()
  const image = useImageFile()
  const { settings, actions } = useOverlaySettings()
  const [controlsHidden, setControlsHidden] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  useOverlayGestures({
    targetRef: stageRef,
    transform: settings.transform,
    onChange: actions.updateTransform,
    enabled: Boolean(image.src) && !settings.locked,
  })

  const pickImage = (file: File) => {
    image.setFile(file)
    actions.resetTransform()
  }

  return (
    <main className={styles.app}>
      <div className={styles.viewport}>
        <Stage ref={stageRef}>
          {camera.status === 'ready' ? (
            <CameraView stream={camera.stream} />
          ) : (
            <CameraMessage state={camera} />
          )}
          {image.src && (
            <OverlayImage
              src={image.src}
              opacity={settings.opacity}
              transform={settings.transform}
              flipped={settings.flipped}
            />
          )}
        </Stage>
      </div>
      {controlsHidden ? (
        <ShowControlsLayer onShow={() => setControlsHidden(false)} />
      ) : (
        <OverlayControls
          settings={settings}
          hasImage={Boolean(image.src)}
          onPickImage={pickImage}
          onOpacityChange={actions.setOpacity}
          onToggleFlipped={actions.toggleFlipped}
          onResetTransform={actions.resetTransform}
          onToggleLocked={actions.toggleLocked}
          onHide={() => setControlsHidden(true)}
        />
      )}
    </main>
  )
}
