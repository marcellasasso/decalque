import { useState } from 'react'
import styles from './App.module.css'
import { CameraMessage } from './components/CameraMessage'
import { CameraView } from './components/CameraView'
import { ControlBar } from './components/ControlBar'
import { ImagePickerButton } from './components/ImagePickerButton'
import { OpacitySlider } from './components/OpacitySlider'
import { OverlayImage } from './components/OverlayImage'
import { Stage } from './components/Stage'
import { useCamera } from './hooks/useCamera'
import { useImageFile } from './hooks/useImageFile'

const DEFAULT_OPACITY = 0.5

export default function App() {
  const camera = useCamera()
  const image = useImageFile()
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY)

  return (
    <main className={styles.app}>
      <div className={styles.viewport}>
        <Stage>
          {camera.status === 'ready' ? (
            <CameraView stream={camera.stream} />
          ) : (
            <CameraMessage state={camera} />
          )}
          {image.src && <OverlayImage src={image.src} opacity={opacity} />}
        </Stage>
      </div>
      <ControlBar>
        <OpacitySlider value={opacity} onChange={setOpacity} />
        <ImagePickerButton onPick={image.setFile} />
      </ControlBar>
    </main>
  )
}
