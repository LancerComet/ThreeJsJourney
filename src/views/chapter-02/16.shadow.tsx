import { AmbientLight, CameraHelper, DirectionalLight, PlaneGeometry, PointLight } from 'three'
import { defineComponent } from 'vue'
import { useBoxGeometry, usePlaneGeometry } from '../../core/geometries'
import { useAmbientLight, useDirectionalLight, usePointLight } from '../../core/lights'
import { useThreeScene } from '../../core/three-scene'

const Shadow = defineComponent({
  name: 'Shadow',

  setup () {
    const { ThreeScene, scene } = useThreeScene({
      backgroundColor: 0,
      useShadow: true,
      antialias: true
    })

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
      width: 20,
      height: 20,
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

    const {
      DirectionalLight,
      light: directionalLight
    } = useDirectionalLight({
      color: 0xb6e5fb,
      intensity: 0.3,
      castShadow: true,
      position: [4, 4, 4],
      shadowConfig: {
        // Higher number gives the smoother shadow.
        mapSize: [2048, 2048],
        camera: {
          near: 1,
          far: 10
        }
      }
    })

    // directionalLight.shadow.camera.top = 1
    // directionalLight.shadow.camera.right = 1
    // directionalLight.shadow.camera.bottom = -1
    // directionalLight.shadow.camera.left = -1

    const shadowCameraHelper = new CameraHelper(directionalLight.shadow.camera)
    scene.add(shadowCameraHelper)

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
