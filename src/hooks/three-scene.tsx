import * as dat from 'lil-gui'
import { AxesHelper, Clock, Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const useThreeScene = (param?: {
  backgroundColor?: number
  useAxesHelper?: boolean
}) => {
  const scene = new Scene()
  scene.background = new Color(param?.backgroundColor ?? 0xaaaaaa)

  const onTickCallbacks: (() => void)[] = []

  const gui = new dat.GUI()
  const clock = new Clock()

  const ThreeScene = defineComponent({
    name: 'BasicScene',
    setup () {
      const element = ref<HTMLElement>()
      let isTickStart = true

      const renderer = new WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)

      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(5, 5, 5)
      scene.add(camera)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.1

      const useAxesHelper = param?.useAxesHelper ?? true
      if (useAxesHelper) {
        const axesHelper = new AxesHelper()
        scene.add(axesHelper)
      }

      const tick = () => {
        controls.update()
        renderer.render(scene, camera)
        onTickCallbacks.forEach(item => item())
        if (isTickStart) {
          requestAnimationFrame(tick)
        }
      }

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })

      onMounted(() => {
        element.value?.appendChild(renderer.domElement)
        tick()
      })

      onBeforeUnmount(() => {
        isTickStart = false
        gui.destroy()
        clock.stop()
      })

      return () => (
        <div ref={element}/>
      )
    }
  })

  const onTick = (callback: () => void) => {
    if (!onTickCallbacks.includes(callback)) {
      onTickCallbacks.push(callback)
    }
  }

  return {
    ThreeScene,
    scene,
    gui,
    onTick,
    clock
  }
}

export {
  useThreeScene
}
