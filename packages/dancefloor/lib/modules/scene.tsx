import { isNumber } from '@lancercomet/utils/types'
import { Color, Scene, WebGLRenderer, ShadowMapType, PCFSoftShadowMap, Clock, Texture } from 'three'
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watchEffect } from 'vue'

import { provideClock } from '../providers/clock'
import { provideContainer } from '../providers/container'
import { provideOnTick } from '../providers/ontick'
import { provideRenderer } from '../providers/renderer'
import { provideOnResize } from '../providers/resize'

const useScene = (param?: {
  antialias?: boolean
  useShadow?: boolean
  shadowType?: ShadowMapType
  width?: number
  height?: number
}) => {
  let width = param?.width ?? window.innerWidth
  let height = param?.height ?? window.innerHeight

  const clock = new Clock()
  const scene = new Scene()

  const renderer = new WebGLRenderer({
    antialias: param?.antialias === true
  })
  const useShadow = param?.useShadow === true
  if (useShadow) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = param?.shadowType ?? PCFSoftShadowMap
  }
  renderer.setSize(width, height)

  const onResizeCallback: Array<(width: number, height: number) => void> = []
  const onTickCallbacks: (() => void)[] = []

  const onResize = (callback: (width: number, height: number) => void) => {
    if (!onResizeCallback.includes(callback)) {
      onResizeCallback.push(callback)
    }
    return () => {
      const index = onResizeCallback.indexOf(callback)
      if (index > -1) {
        onResizeCallback.splice(index, 1)
      }
    }
  }
  provideOnResize(onResize)

  const doResize = () => {
    for (const func of onResizeCallback) {
      func(width, height)
    }
    renderer.setSize(width, height)
  }

  const onTick = (callback: () => void) => {
    if (!onTickCallbacks.includes(callback)) {
      onTickCallbacks.push(callback)
    }
    return () => {
      const index = onTickCallbacks.indexOf(callback)
      if (index > -1) {
        onTickCallbacks.splice(index, 1)
      }
    }
  }
  provideOnTick(onTick)

  const SceneComponent = defineComponent({
    name: 'Scene',

    props: {
      background: {
        type: [Object, Number] as PropType<Color | Texture | number>,
        default: () => new Color(0)
      }
    },

    setup (props, { slots }) {
      provideClock(clock)
      provideContainer(scene)
      provideRenderer(renderer)

      let isTickStart = true
      const element = ref<HTMLElement>()

      const tick = () => {
        for (const func of onTickCallbacks) {
          func()
        }
        if (isTickStart) {
          requestAnimationFrame(tick)
        }
      }

      const setBackground = () => {
        const newBackground = isNumber(props.background)
          ? new Color(props.background)
          : props.background

        const isColorSame = scene.background instanceof Color &&
          newBackground instanceof Color &&
          scene.background.equals(newBackground)

        if (isColorSame) {
          return
        }

        const isBackgroundChanged = scene.background !== newBackground
        if (isBackgroundChanged) {
          scene.background = newBackground
        }
      }

      const revokeWatch = watchEffect(() => {
        setBackground()
      })

      onMounted(() => {
        element.value?.appendChild(renderer.domElement)
        tick()
      })

      onBeforeUnmount(() => {
        isTickStart = false
        revokeWatch()
        clock.stop()
      })

      return () => (
        <div class='scene' ref={element}>{slots.default?.()}</div>
      )
    }
  })

  return {
    Scene: SceneComponent,
    onTick,
    scene,
    renderer,
    clock,
    resize: (w: number, h: number) => {
      width = w
      height = h
      doResize()
    }
  }
}

export {
  useScene
}
