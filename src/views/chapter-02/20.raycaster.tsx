import { Vector3 } from 'three'
import { defineComponent } from 'vue'
import { useSphereGeometry } from '../../core.v2/geometries'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { useStandardMaterial } from '../../core.v2/materials'
import { useMesh } from '../../core.v2/mesh'
import { useRayCaster } from '../../core.v2/raycaster'
import { useScene } from '../../core.v2/scene'

const RayCasterPage = defineComponent({
  name: 'RayCasterPage',
  setup () {
    const { Scene } = useScene()
    const { RayCaster, rayCaster } = useRayCaster()
    const { Mesh } = useMesh()
    const { StandardMaterial } = useStandardMaterial()
    const { SphereGeometry } = useSphereGeometry()
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()

    const Sphere = (x: number) => (
      <Mesh position={{ x }} receiveShadow>
        <SphereGeometry />
        <StandardMaterial />
      </Mesh>
    )

    const Sphere1 = () => Sphere(-3)
    const Sphere2 = () => Sphere(0)
    const Sphere3 = () => Sphere(3)

    const rayOrigin = new Vector3(-5, 0, 0)
    const rayDirection = new Vector3(10, 0, 0)
    rayDirection.normalize()

    return () => (
      <Scene>
        <Sphere1 />
        <Sphere2 />
        <Sphere3 />
        <AmbientLight />
        <PointLight position={{ x: 5, y: 5, z: 5 }} castShadow />
        <RayCaster origin={rayOrigin} direction={rayDirection} />
      </Scene>
    )
  }
})

export {
  RayCasterPage
}
