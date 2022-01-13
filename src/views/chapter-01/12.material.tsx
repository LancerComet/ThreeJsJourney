import {
  Mesh, MeshMatcapMaterial,
  PlaneGeometry,
  SphereGeometry, TextureLoader,
  TorusGeometry
} from 'three'
import { defineComponent } from 'vue'
import { useThreeScene } from '../../hooks/three-scene'

const Material = defineComponent({
  name: 'Material',
  setup () {
    const { ThreeScene, scene, onTick, clock, gui } = useThreeScene({
      backgroundColor: 0
    })

    const textureLoader = new TextureLoader()
    // const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
    // const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    // const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
    // const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
    // const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
    // const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
    // const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
    const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
    // const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

    // const material = new MeshBasicMaterial({
    //   map: doorColorTexture,
    //   alphaMap: doorAlphaTexture,
    //   transparent: true
    // })
    const material = new MeshMatcapMaterial({
      matcap: matcapTexture
    })

    gui.add(material, 'wireframe')

    const sphere = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      material
    )
    sphere.position.x = -1.5

    const plane = new Mesh(
      new PlaneGeometry(1, 1),
      material
    )

    const torus = new Mesh(
      new TorusGeometry(0.3, 0.2, 16, 32),
      material
    )
    torus.position.x = 1.5

    onTick(() => {
      const elapsedTime = clock.getElapsedTime()
      sphere.rotation.y = 0.1 * elapsedTime
      plane.rotation.y = 0.1 * elapsedTime
      torus.rotation.y = 0.1 * elapsedTime

      sphere.rotation.x = 0.15 * elapsedTime
      plane.rotation.x = 0.15 * elapsedTime
      torus.rotation.x = 0.15 * elapsedTime
    })

    scene.add(sphere, plane, torus)

    return () => (
      <ThreeScene />
    )
  }
})

export {
  Material
}
