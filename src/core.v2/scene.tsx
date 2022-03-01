/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dat from 'lil-gui'
import {
  Color, OrthographicCamera,
  PerspectiveCamera, Scene, Vector3,
  WebGLRenderer,
  ShadowMapType, PCFSoftShadowMap, Clock, Texture
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, onMounted, PropType, provide, ref, watch } from 'vue'
import { provideContainer } from './providers/container'
import { isNumber } from './utils/type'

const useScene = (param?: {
  camera?: PerspectiveCamera | OrthographicCamera
  useControl?: boolean
  antialias?: boolean
  useShadow?: boolean
  shadowType?: ShadowMapType
  onResize?: () => void
}) => {
  let isTickStart = true

  const gui = new dat.GUI()
  const clock = new Clock()

  const scene = new Scene()
  provideContainer(scene)

  let camera = param?.camera
  if (!camera) {
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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
  renderer.setSize(window.innerWidth, window.innerHeight)

  const controls = new OrbitControls(camera!, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1

  if (!param?.useControl) {
    controls.enabled = false
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
      const element = ref<HTMLElement>()

      const tick = () => {
        controls?.update()
        renderer.render(scene, camera!)
        onTickCallbacks.forEach(item => item())
        if (isTickStart) {
          requestAnimationFrame(tick)
        }
      }

      const onResize = () => {
        if (camera instanceof PerspectiveCamera) {
          camera.aspect = window.innerWidth / window.innerHeight
        }
        if (typeof param?.onResize === 'function') {
          param.onResize()
        }
        camera?.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
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

      watch(props, setProps, {
        deep: true,
        immediate: true
      })

      window.addEventListener('resize', onResize)

      onMounted(() => {
        element.value?.appendChild(renderer.domElement)
      })

      onBeforeUnmount(() => {
        isTickStart = false
        window.removeEventListener('resize', onResize)
        clock.stop()
        gui.destroy()
      })

      tick()

      return () => (
        <div class='scene' data-uuid={scene.uuid} ref={element}>{slots.default?.()}</div>
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
    gui,
    camera,
    scene,
    renderer,
    clock,
    controls
  }
}

export {
  useScene
}
