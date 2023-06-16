import type { Object3D } from 'three'
import { inject, provide } from 'vue'

const CONTAINER_INJECT_KEY = 'three:container'

const provideContainer = (container: Object3D) => {
  provide(CONTAINER_INJECT_KEY, container)
}

const injectContainer = () => {
  return inject<Object3D | undefined>(CONTAINER_INJECT_KEY, () => {
    console.warn('[Warn] You should inject a container under a container object.')
    return undefined
  }, true)
}

export {
  provideContainer,
  injectContainer
}
