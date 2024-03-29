import { inject, provide } from 'vue'

const INJECT_KEY = 'three:ontick'

type OnTickFunc = (callback: () => void) => void

const provideOnTick = (onTick: OnTickFunc) => {
  provide(INJECT_KEY, onTick)
}

const injectOnTick = () => {
  return inject<OnTickFunc | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should inject a Tick object under a <Scene />.')
    return undefined
  }, true)
}

export {
  provideOnTick,
  injectOnTick,
  OnTickFunc
}
