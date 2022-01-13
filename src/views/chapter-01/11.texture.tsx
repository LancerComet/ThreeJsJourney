import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, TextureLoader } from 'three'
import { defineComponent, onMounted } from 'vue'
import { useThreeScene } from '../../hooks/three-scene'

const Textures = defineComponent({
  name: 'Texture',
  setup () {
    const { ThreeScene, scene } = useThreeScene()

    onMounted(async () => {
      const textureLoader = new TextureLoader()

      const colorTexture = await textureLoader.loadAsync('/texture/door/color.jpg')
      colorTexture.needsUpdate = true
      colorTexture.minFilter = NearestFilter

      // Repeat texture.
      // ===
      // colorTexture.repeat.x = 2
      // colorTexture.wrapS = RepeatWrapping

      // colorTexture.repeat.y = 2
      // colorTexture.wrapT = RepeatWrapping

      const cube = new BoxGeometry(5, 5, 5)
      const cubeMaterial = new MeshBasicMaterial({
        map: colorTexture
      })
      const cubeMesh = new Mesh(cube, cubeMaterial)
      scene.add(cubeMesh)
    })

    return () => (
      <ThreeScene/>
    )
  }
})

export {
  Textures
}
