import type { Clock } from 'three'
import { inject, provide } from 'vue'

const INJECT_KEY = 'three:clock'

const provideClock = (clock: Clock) => {
  provide(INJECT_KEY, clock)
}

const injectClock = () => {
  return inject<Clock | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use inject a clock under a <Scene />.')
    return undefined
  }, true)
}

export {
  provideClock,
  injectClock
}
