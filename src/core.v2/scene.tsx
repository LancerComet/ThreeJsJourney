/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Color, OrthographicCamera,
  PerspectiveCamera, Scene, Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'

const injectKey = 'scene'

const useScene = (param?: {
  camera?: PerspectiveCamera | OrthographicCamera
  backgroundColor?: number
  useControl?: boolean
  antialias?: boolean
  useShadow?: boolean
}) => {
  const onTickCallbacks: (() => void)[] = []

  const onTick = (callback: () => void) => {
    if (!onTickCallbacks.includes(callback)) {
      onTickCallbacks.push(callback)
    }
  }

  return {
    Scene: defineComponent({
      name: 'Scene',
      setup (props, { slots }) {
        let isTickStart = true
        const element = ref<HTMLElement>()

        const scene = new Scene()
        scene.background = new Color(param?.backgroundColor ?? 0)
        provide(injectKey, scene)

        let camera = param?.camera
        if (!camera) {
          camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
          camera.position.set(5, 5, 5)
          camera.lookAt(new Vector3(0, 0, 0))
        }
        scene.add(camera)

        const renderer = new WebGLRenderer({
          antialias: param?.antialias === true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)

        let controls: OrbitControls
        if (param?.useControl ?? true) {
          controls = new OrbitControls(camera, renderer.domElement)
          controls.enableDamping = true
          controls.dampingFactor = 0.1
        }

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
          camera?.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('resize', onResize)

        onMounted(() => {
          element.value?.appendChild(renderer.domElement)
        })

        onBeforeUnmount(() => {
          isTickStart = false
          window.removeEventListener('resize', onResize)
        })

        tick()

        return () => (
          <div class='scene' data-uuid={scene.uuid} ref={element}>{slots.default?.()}</div>
        )
      }
    }),
    onTick
  }
}

const getScene = () => {
  return inject<Scene | undefined>(injectKey, () => {
    console.warn('You should use this component under <Scene/>.')
    return undefined
  }, true)
}

export {
  useScene,
  getScene
}
