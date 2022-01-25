import {
  AmbientLight, BufferAttribute, CubeTextureLoader, DoubleSide,
  Mesh, MeshMatcapMaterial, MeshStandardMaterial,
  PlaneGeometry, PointLight,
  SphereGeometry, TextureLoader,
  TorusGeometry
} from 'three'
import { defineComponent } from 'vue'
import { useThreeScene } from '../../core/three-scene'

const Material = defineComponent({
  name: 'Material',
  setup () {
    const { ThreeScene, scene, onTick, clock } = useThreeScene({
      backgroundColor: 0xaaaaaa
    })

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new PointLight(0xffffff, 0.5)
    pointLight.position.set(2, 3, 4)
    scene.add(pointLight)

    const textureLoader = new TextureLoader()

    const sphere = new Mesh(
      new SphereGeometry(0.5, 64, 64),
      new MeshStandardMaterial({
        roughness: 0,
        metalness: 0.8,
        envMap: new CubeTextureLoader().load([
          '/textures/environmentMaps/0/px.jpg',
          '/textures/environmentMaps/0/nx.jpg',
          '/textures/environmentMaps/0/py.jpg',
          '/textures/environmentMaps/0/ny.jpg',
          '/textures/environmentMaps/0/pz.jpg',
          '/textures/environmentMaps/0/nz.jpg'
        ])
      })
    )
    sphere.position.x = -1.5

    const plane = new Mesh(
      new PlaneGeometry(1, 1, 100, 100),
      new MeshStandardMaterial({
        map: textureLoader.load('/textures/door/color.jpg'),

        alphaMap: textureLoader.load('/textures/door/alpha.jpg'),
        transparent: true,

        aoMap: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
        aoMapIntensity: 1,

        displacementMap: textureLoader.load('/textures/door/height.jpg'),
        displacementScale: 0.05,

        side: DoubleSide
      })
    )
    plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2))

    const torus = new Mesh(
      new TorusGeometry(0.3, 0.2, 16, 128),
      new MeshMatcapMaterial({
        matcap: textureLoader.load('/textures/matcaps/1.png')
      })
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
