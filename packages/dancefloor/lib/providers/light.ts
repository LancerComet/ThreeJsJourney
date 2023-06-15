import type { Light } from 'three'
import { inject, provide } from 'vue'

const INJECT_KEY = 'three:light'

const provideLight = (light: Light) => {
  provide(INJECT_KEY, light)
}

const injectLight = () => {
  return inject<Light | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this injection under a light object.')
    return undefined
  }, true)
}

export {
  provideLight,
  injectLight
}
