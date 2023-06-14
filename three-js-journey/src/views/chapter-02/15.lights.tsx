import {
  BoxGeometry, PlaneGeometry, AmbientLight,
  DirectionalLight, PointLight, StandardMaterial,
  Mesh, useScene, PerspectiveCamera, OrbitControls,
  RectAreaLight, RectAreaLightHelper,
  HemisphereLight, HemisphereLightHelper
} from '@lancercomet/dancefloor'
import { defineComponent } from 'vue'
import { useResize } from '../../hooks/resize'

const Lights = defineComponent({
  name: 'Lights',
  setup () {
    const { Scene, resize } = useScene()

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <AmbientLight color={0xffffff} intensity={0.5}/>
        <DirectionalLight showHelper color={0xb6e5fb} intensity={0.3} position={{ x: 4, y: 4, z: 4 }} />
        <PointLight color={0xffff00} intensity={0.5} distance={10} decay={1} position={{ x: -4, y: 2, z: 4 }} />

        <HemisphereLight
          groundColor={0x0000ff} skyColor={0xff0000}
          intensity={0.3} position={{ x: 3, y: 1, z: 1 }}
        >
          <HemisphereLightHelper size={1} />
        </HemisphereLight>

        <RectAreaLight
          color={0x4e00ff} intensity={2} width={1} height={1}
          position={{ x: -1, y: 0, z: -1 }}
        >
          <RectAreaLightHelper />
        </RectAreaLight>

        <Mesh>
          <BoxGeometry />
          <StandardMaterial />
        </Mesh>

        <Mesh position={{ x: 0, y: -0.5, z: 0 }} rotation={{ x: (-90 / 180) * Math.PI }}>
          <PlaneGeometry width={10} height={10} />
          <StandardMaterial />
        </Mesh>
      </Scene>
    )
  }
})

export {
  Lights
}
