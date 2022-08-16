/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isNumber } from '@lancercomet/utils/types'
import * as dat from 'lil-gui'
import {
  Color, OrthographicCamera,
  PerspectiveCamera, Scene, Vector3,
  WebGLRenderer,
  ShadowMapType, PCFSoftShadowMap, Clock, Texture
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { provideContainer } from './providers/container'

const useScene = (param?: {
  camera?: PerspectiveCamera | OrthographicCamera
  useControl?: boolean
  antialias?: boolean
  useShadow?: boolean
  useGui?: boolean
  shadowType?: ShadowMapType
  onResize?: () => void
}) => {
  const clock = new Clock()

  const useGui = param?.useGui ?? true
  let gui: dat.GUI | undefined
  if (useGui) {
    gui = new dat.GUI()
  }

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

  let controls: OrbitControls | undefined
  const useControl = param?.useControl ?? true
  if (useControl) {
    controls = new OrbitControls(camera!, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
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

      const revoke = watch(props, setProps, {
        deep: true,
        immediate: true
      })

      window.addEventListener('resize', onResize)

      onMounted(() => {
        element.value?.appendChild(renderer.domElement)
        tick()
      })

      onBeforeUnmount(() => {
        isTickStart = false
        window.removeEventListener('resize', onResize)
        clock.stop()
        gui?.destroy()
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
