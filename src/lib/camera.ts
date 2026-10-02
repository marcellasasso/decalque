import type { Lens } from '../types'

export type LensDevices = Partial<Record<Lens, string>>

const RESOLUTION = { width: { ideal: 1920 }, height: { ideal: 1440 } }

// Nomes das câmeras no iOS, em inglês ou português conforme o idioma do aparelho.
const BACK = /back|rear|traseir|trás/i
const ULTRA_WIDE = /ultra/i
const TELEPHOTO = /tele/i
// Câmeras "Dupla"/"Tripla" são virtuais e trocam de lente sozinhas, o que desalinharia a imagem.
const VIRTUAL = /dual|dupla|triple|tripla/i

// Fora de HTTPS o navegador não expõe navigator.mediaDevices.
export function isCameraSupported(): boolean {
  return 'mediaDevices' in navigator && typeof navigator.mediaDevices.getUserMedia === 'function'
}

/** Abre a câmera pedida ou, sem deviceId (ou se ele sumiu), a traseira padrão. */
export async function openStream(deviceId?: string): Promise<MediaStream> {
  const fallback = () =>
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, ...RESOLUTION },
    })
  if (!deviceId) return fallback()
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { deviceId: { exact: deviceId }, ...RESOLUTION },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') throw error
    return fallback()
  }
}

export function stopStream(stream: MediaStream | undefined) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function streamDeviceId(stream: MediaStream): string | undefined {
  return stream.getVideoTracks()[0]?.getSettings().deviceId
}

/** Só funciona depois da permissão concedida: antes disso os nomes vêm vazios. */
export async function findLensDevices(): Promise<LensDevices> {
  const backCameras = (await navigator.mediaDevices.enumerateDevices()).filter(
    (device) =>
      device.kind === 'videoinput' && BACK.test(device.label) && !VIRTUAL.test(device.label),
  )
  const ultraWide = backCameras.find((device) => ULTRA_WIDE.test(device.label))
  const wide = backCameras.find(
    (device) => !ULTRA_WIDE.test(device.label) && !TELEPHOTO.test(device.label),
  )
  return { wide: wide?.deviceId, ultraWide: ultraWide?.deviceId }
}
