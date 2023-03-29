/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isNumber } from '@lancercomet/utils/types'
import {
  Color, OrthographicCamera,
  PerspectiveCamera, Scene, Vector3,
  WebGLRenderer,
  ShadowMapType, PCFSoftShadowMap, Clock, Texture
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { provideContainer } from '../providers/container'

const useScene = (param?: {
  camera?: PerspectiveCamera | OrthographicCamera
  useControl?: boolean
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
  provideContainer(scene)

  let camera = param?.camera
  if (!camera) {
    camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(5, 5, 5)
    camera.lookAt(new Vector3(0, 0, 0))
  }
  scene.add(camera!)

  const renderer = new WebGLRenderer({
    antialias: param?.antialias === true
  })

  const useShadow = param?.useShadow === true
  if (useShadow) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = param?.shadowType ?? PCFSoftShadowMap
  }
  renderer.setSize(width, height)

  let controls: OrbitControls | undefined
  const useControl = param?.useControl ?? true
  if (useControl) {
    controls = new OrbitControls(camera!, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
  }

  const doResize = () => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = width / height
    }
    camera?.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  const SceneComponent = defineComponent({
    name: 'Scene',

    props: {
      background: {
        type: [Object, Number] as PropType<Color | Texture | number>,
        default: () => new Color(0)
      }
    },

    setup (props, { slots }) {
      let isTickStart = true
      const element = ref<HTMLElement>()

      const tick = () => {
        controls?.update()
        renderer.render(scene, camera!)
        onTickCallbacks.forEach(item => item())
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
          scene.background = newBackground ?? null
        }
      }

      const setProps = () => {
        setBackground()
      }

      const revoke = watch(props, setProps, {
        deep: true,
        immediate: true
      })

      onMounted(() => {
        element.value?.appendChild(renderer.domElement)
        tick()
      })

      onBeforeUnmount(() => {
        isTickStart = false
        clock.stop()
        revoke()
      })

      return () => (
        <div class='scene' ref={element}>{slots.default?.()}</div>
      )
    }
  })

  const onTickCallbacks: (() => void)[] = []
  const onTick = (callback: () => void) => {
    if (!onTickCallbacks.includes(callback)) {
      onTickCallbacks.push(callback)
    }
  }

  return {
    Scene: SceneComponent,
    onTick,
    camera,
    scene,
    renderer,
    clock,
    controls,
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
