import { BufferGeometry } from 'three'
import { inject, provide } from 'vue'

const INJECT_KEY = 'three:geometry'

const provideGeometry = (geometry: BufferGeometry) => {
  provide(INJECT_KEY, geometry)
}

const injectGeometry = () => {
  return inject<BufferGeometry | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this under a Geometry object.')
    return undefined
  }, true)
}

export {
  provideGeometry,
  injectGeometry
}
