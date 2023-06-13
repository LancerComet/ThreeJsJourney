import { inject, provide } from 'vue'

const INJECT_KEY = 'three:resize'

type ResizeCallback = (width: number, height: number) => void
type OnResizeFunc = (callback: ResizeCallback) => () => void

const provideOnResize = (onResize: OnResizeFunc) => {
  provide(INJECT_KEY, onResize)
}

const injectOnResize = () => {
  return inject<OnResizeFunc | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this injection under <Scene />.')
    return () => {
      return () => {
        // ...
      }
    }
  }, true)
}

export {
  provideOnResize,
  injectOnResize
}
