import { AmbientLight, DirectionalLight, PlaneGeometry, PointLight } from 'three'
import { defineComponent } from 'vue'
import { useBoxGeometry, usePlaneGeometry } from '../../core/geometries'
import { useAmbientLight, useDirectionalLight, usePointLight } from '../../core/lights'
import { useThreeScene } from '../../core/three-scene'

const Shadow = defineComponent({
  name: 'Shadow',

  setup () {
    const { Geometry: Cube1 } = useBoxGeometry({
      position: [2, 0, 0],
      castShadow: true
    })

    const { Geometry: Cube2 } = useBoxGeometry({
      castShadow: true
    })

    const { Geometry: Cube3 } = useBoxGeometry({
      position: [-2, 0, 0],
      castShadow: true
    })

    const { Geometry: PlaneGeometry, mesh: plane } = usePlaneGeometry({
      width: 10,
      height: 10,
      position: [0, -0.5, 0],
      receiveShadow: true
    })
    plane.rotation.x = (-90 / 180) * Math.PI

    const { AmbientLight } = useAmbientLight({
      color: 0xffffff,
      intensity: 0.5
    })

    const { PointLight } = usePointLight({
      color: 0xffd9a0,
      intensity: 0.5,
      distance: 10,
      decay: 1,
      castShadow: true,
      position: [-4, 2, 4]
    })

    const { DirectionalLight } = useDirectionalLight({
      color: 0xb6e5fb,
      intensity: 0.3,
      castShadow: true,
      position: [4, 4, 4],
      shadowConfig: {
        mapSize: [2048, 2048] // Higher number gives the smoother shadow.
      }
    })

    const { ThreeScene } = useThreeScene({
      backgroundColor: 0,
      useShadow: true,
      antialias: true
    })

    return () => (
      <ThreeScene>
        <Cube1 />
        <Cube2 />
        <Cube3 />
        <AmbientLight />
        <PointLight />
        <DirectionalLight />
        <PlaneGeometry />
      </ThreeScene>
    )
  }
})

export {
  Shadow
}
