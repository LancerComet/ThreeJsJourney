import { Object3D, Scene } from 'three'
import { inject, provide } from 'vue'

const injectKey = 'three:container'

const provideContainer = (container: Object3D) => {
  provide(injectKey, container)
}

const injectContainer = () => {
  return inject<Object3D | undefined>(injectKey, () => {
    console.warn('[Warn] You should use this under a container object.')
    return undefined
  }, true)
}

export {
  provideContainer,
  injectContainer
}
