import {
  BoxGeometry, PlaneGeometry,
  AmbientLight, DirectionalLight, PointLight,
  StandardMaterial, Mesh, useScene, PerspectiveCamera, OrbitControls, DirectionalLightTarget
} from '@lancercomet/dancefloor'
import { defineComponent } from 'vue'
import { useResize } from '../../hooks/resize'

const Shadow = defineComponent({
  name: 'Shadow',

  setup () {
    const { Scene, resize } = useScene({
      useShadow: true,
      antialias: true
    })

    const Cube1 = () => {
      return (
        <Mesh position={{ x: 2, y: 0, z: 0 }} castShadow>
          <StandardMaterial />
          <BoxGeometry />
        </Mesh>
      )
    }

    const Cube2 = () => {
      return (
        <Mesh castShadow>
          <StandardMaterial />
          <BoxGeometry />
        </Mesh>
      )
    }

    const Cube3 = () => {
      return (
        <Mesh position={{ x: -2, y: 0, z: 0 }} castShadow>
          <StandardMaterial />
          <BoxGeometry />
        </Mesh>
      )
    }

    const Ground = () => {
      return (
        <Mesh receiveShadow position={{ x: 0, y: -0.5, z: 0 }} rotation={{ x: (-90 / 180) * Math.PI }}>
          <PlaneGeometry width={20} height={20} />
          <StandardMaterial />
        </Mesh>
      )
    }

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <Cube1 />
        <Cube2 />
        <Cube3 />
        <AmbientLight color={0xffffff} intensity={0.5} />

        <DirectionalLight
          position={{ x: 4, y: 4, z: 4 }}
          color={0xb6e5fb} intensity={0.3}
          castShadow
          shadow={{
            mapSize: { width: 2048, height: 2048 },
            camera: { near: 1, far: 10 }
          }}
          showHelper helper={{ color: 0xff0000 }}
        >
          <DirectionalLightTarget position={{ x: 3, y: 0, z: 3 }} />
        </DirectionalLight>

        <Ground />
      </Scene>
    )
  }
})

export {
  Shadow
}
