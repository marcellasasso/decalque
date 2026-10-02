import type { CameraState } from '../hooks/useCamera'
import styles from './CameraMessage.module.css'

type Props = {
  state: Exclude<CameraState, { status: 'ready' }>
}

function messageFor(state: Props['state']): string {
  switch (state.status) {
    case 'loading':
      return 'Abrindo a câmera…'
    case 'denied':
      return 'Sem permissão para usar a câmera. Libere o acesso e recarregue a página.'
    case 'unsupported':
      return 'Este navegador não liberou a câmera. O site precisa ser aberto em HTTPS.'
    case 'error':
      return `Não foi possível abrir a câmera: ${state.message}`
  }
}

export function CameraMessage({ state }: Props) {
  return (
    <p className={styles.message} role={state.status === 'loading' ? 'status' : 'alert'}>
      {messageFor(state)}
    </p>
  )
}
