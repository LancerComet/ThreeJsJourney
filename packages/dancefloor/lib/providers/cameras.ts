import { Camera } from 'three'
import { inject, provide } from 'vue'

const INJECT_KEY = 'three:camera'

const provideCamera = (camera: Camera) => {
  provide(INJECT_KEY, camera)
}

const injectCamera = () => {
  return inject<Camera | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this under a container object.')
    return undefined
  }, true)
}

export {
  provideCamera,
  injectCamera
}
