import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry, PointLight, PointLightHelper,
  Vector3
} from 'three'
import { defineComponent } from 'vue'
import { useThreeScene } from '../../hooks/three-scene'

const Lights = defineComponent({
  name: 'Lights',
  setup () {
    const { ThreeScene, scene } = useThreeScene({
      backgroundColor: 0
    })

    const plane = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial()
    )
    plane.position.set(0, -1, 0)
    plane.rotation.x = (-90 / 180) * Math.PI
    scene.add(plane)

    const cube = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial()
    )
    scene.add(cube)

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xb6e5fb, 0.3)
    directionalLight.position.set(4, 4, 4)
    scene.add(directionalLight)

    const directionalLightHelper = new DirectionalLightHelper(directionalLight)
    scene.add(directionalLightHelper)

    const pointLight = new PointLight(0xffff00, 0.5)
    scene.add(pointLight)
    pointLight.position.set(-4, 2, 4)

    const pointLightHelper = new PointLightHelper(pointLight)
    scene.add(pointLightHelper)

    return () => (
      <ThreeScene />
    )
  }
})

export {
  Lights
}
