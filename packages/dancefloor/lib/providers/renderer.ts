import { Renderer } from 'three'
import { inject, provide } from 'vue'

const INJECT_KEY = 'three:renderer'

const provideRenderer = (renderer: Renderer) => {
  provide(INJECT_KEY, renderer)
}

const injectRenderer = () => {
  return inject<Renderer | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this injection under <Scene />.')
    return undefined
  }, true)
}

export {
  provideRenderer,
  injectRenderer
}
