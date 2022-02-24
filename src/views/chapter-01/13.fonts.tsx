import { Mesh, MeshMatcapMaterial, TextureLoader, TorusGeometry, Vector3 } from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { defineComponent, onBeforeMount } from 'vue'
import { useAxesHelper } from '../../core.v2/helpers'
import { useScene } from '../../core.v2/scene'

// Use this to convert a regular font into the TypeFace font.
// http://gero3.github.io/facetype.js/
const Fonts = defineComponent({
  name: 'Fonts',
  setup () {
    const { Scene, scene, onTick, camera } = useScene({
      backgroundColor: 0,
      useControl: false
    })
    const fontLoader = new FontLoader()
    const textureLoader = new TextureLoader()
    const { AxesHelper } = useAxesHelper()

    onBeforeMount(async () => {
      const font = await fontLoader.loadAsync('/fonts/kenpixel.json')

      const matcapMaterial1 = new MeshMatcapMaterial({
        matcap: await textureLoader.loadAsync('/textures/matcaps/1.png')
      })
      const matcapMaterial2 = new MeshMatcapMaterial({
        matcap: await textureLoader.loadAsync('/textures/matcaps/2.png')
      })
      const matcapMaterial3 = new MeshMatcapMaterial({
        matcap: await textureLoader.loadAsync('/textures/matcaps/3.png')
      })

      const getMatcapMaterial = () => {
        const textures = [matcapMaterial1, matcapMaterial2, matcapMaterial3]
        const index = Math.floor(Math.random() * textures.length)
        return textures[index]
      }

      const textGeometry = new TextGeometry('This is sparta!', {
        font,
        size: 0.5,
        height: 0.5,
        curveSegments: 12
      })
      // const textMaterial = new MeshBasicMaterial({
      //   wireframe: true
      // })

      const text = new Mesh(textGeometry, getMatcapMaterial())
      scene.add(text)

      // Make this geometry uses box bounding.
      textGeometry.computeBoundingBox()

      // Make text centered.
      // textGeometry.translate(
      //   (textGeometry.boundingBox?.max?.x ?? 0) * -0.5,
      //   (textGeometry.boundingBox?.max?.y ?? 0) * -0.5,
      //   (textGeometry.boundingBox?.max?.z ?? 0) * -0.5
      // )
      textGeometry.center()

      const donutGeometry = new TorusGeometry(0.3, 0.2, 20, 45)
      const genCount = 10000
      const generatingDistance = 80
      for (let i = 0; i < genCount; i++) {
        const donut = new Mesh(donutGeometry, getMatcapMaterial())
        donut.position.x = (Math.random() - 0.5) * generatingDistance
        donut.position.y = (Math.random() - 0.5) * generatingDistance
        donut.position.z = (Math.random() - 0.5) * generatingDistance
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        scene.add(donut)
      }

      let angle = 0
      const radius = 8
      onTick(() => {
        // Use Math.cos and Math.sin to set camera X and Z values based on angle.
        camera.position.x = radius * Math.cos(angle)
        camera.position.z = radius * Math.sin(angle)
        camera.lookAt(new Vector3(0, 0, 0))
        angle += 0.005
      })
    })

    return () => (
      <Scene>
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  Fonts
}
