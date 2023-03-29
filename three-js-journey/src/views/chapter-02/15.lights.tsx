import {
  BoxGeometry, PlaneGeometry, AmbientLight,
  DirectionalLight, PointLight, StandardMaterial,
  Mesh, useScene
} from '@lancercomet/dancefloor'
import { HemisphereLight, HemisphereLightHelper, RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { defineComponent } from 'vue'

const Lights = defineComponent({
  name: 'Lights',
  setup () {
    const { Scene, scene } = useScene()

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
      <Scene>
        <AmbientLight color={0xffffff} intensity={0.5}/>
        <DirectionalLight showHelper color={0xb6e5fb} intensity={0.3} position={{ x: 4, y: 4, z: 4 }} />
        <PointLight color={0xffff00} intensity={0.5} distance={10} decay={1} position={{ x: -4, y: 2, z: 4 }} />
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