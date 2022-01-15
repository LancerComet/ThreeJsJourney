import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper, HemisphereLight, HemisphereLightHelper,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry, PointLight, PointLightHelper, RectAreaLight,
  Vector3
} from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { defineComponent, ssrContextKey } from 'vue'
import { useThreeScene } from '../../core/three-scene'

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
    plane.position.set(0, -0.5, 0)
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

    const pointLight = new PointLight(0xffff00, 0.5, 10, 1)
    scene.add(pointLight)
    pointLight.position.set(-4, 2, 4)

    const pointLightHelper = new PointLightHelper(pointLight)
    scene.add(pointLightHelper)

    const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.3)
    hemisphereLight.position.set(3, 1, 1)
    scene.add(hemisphereLight)

    const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 1)
    scene.add(hemisphereLightHelper)

    const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1)
    rectAreaLight.position.set(-1, 0, -1)
    scene.add(rectAreaLight)

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
    scene.add(rectAreaLightHelper)

    return () => (
      <ThreeScene />
    )
  }
})

export {
  Lights
}
