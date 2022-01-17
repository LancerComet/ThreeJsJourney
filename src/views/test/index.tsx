import { defineComponent } from 'vue'
import { useBoxGeometry, usePlaneGeometry } from '../../core.v2/geometries'
import { useAxesHelper } from '../../core.v2/helpers'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { useStandardMaterial } from '../../core.v2/materials'
import { useMesh } from '../../core.v2/mesh'
import { useScene } from '../../core.v2/scene'

const TestPage = defineComponent({
  name: 'TestPage',
  setup () {
    const { Scene } = useScene({
      useShadow: true,
      useControl: true
    })
    const { Mesh } = useMesh()
    const { StandardMaterial } = useStandardMaterial()
    const { BoxGeometry } = useBoxGeometry()
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    const { PlaneGeometry } = usePlaneGeometry()
    const { AxesHelper } = useAxesHelper()

    const Plane = () => (
      <Mesh
        receiveShadow
        position={{ y: -0.5 }}
        rotation={{ x: (-90 / 180) * Math.PI }}
      >
        <PlaneGeometry width={10} height={10} />
        <StandardMaterial />
      </Mesh>
    )

    const Cube = () => (
      <Mesh castShadow={true} receiveShadow={true}>
        <BoxGeometry />
        <StandardMaterial />
      </Mesh>
    )

    return () => (
      <Scene>
        <Cube />
        <Plane />
        <AmbientLight castShadow/>
        <PointLight castShadow showHelper position={{ x: 4, y: 4, z: 4 }} />
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  TestPage
}
