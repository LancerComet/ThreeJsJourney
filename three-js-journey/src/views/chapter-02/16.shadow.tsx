import {
  BoxGeometry, PlaneGeometry,
  AmbientLight, DirectionalLight, PointLight,
  StandardMaterial, Mesh, useScene
} from '@lancercomet/dancefloor'
import { defineComponent } from 'vue'

const Shadow = defineComponent({
  name: 'Shadow',

  setup () {
    const { Scene } = useScene({
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

    return () => (
      <Scene>
        <Cube1 />
        <Cube2 />
        <Cube3 />
        <AmbientLight color={0xffffff} intensity={0.5} />
        <PointLight
          color={0xffd9a0} intensity={0.5} distance={10} decay={1}
          castShadow position={{ x: -4, y: 2, z: 4 }} showHelper
        />
        <DirectionalLight
          color={0xb6e5fb} intensity={0.3}
          castShadow position={{ x: 4, y: 4, z: 4 }}
          shadowSize={2048} showHelper shadowCamera={{ near: 1, far: 10 }}
        />
        <Ground />
      </Scene>
    )
  }
})

export {
  Shadow
}
