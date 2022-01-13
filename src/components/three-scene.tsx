import { AxesHelper, Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onMounted, ref } from 'vue'

const useThreeScene = (param?: {
  backgroundColor?: number
}) => {
  const scene = new Scene()
  scene.background = new Color(param?.backgroundColor ?? 0xaaaaaa)

  const ThreeScene = defineComponent({
    name: 'BasicScene',
    setup () {
      const element = ref<HTMLElement>()

      const renderer = new WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)

      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(10, 10, 10)
      scene.add(camera)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.1

      const axesHelper = new AxesHelper()
      scene.add(axesHelper)

      const tick = () => {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
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

      return () => (
        <div ref={element}/>
      )
    }
  })

  return {
    ThreeScene,
    scene
  }
}

export {
  useThreeScene
}
