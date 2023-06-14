import {
  BufferAttribute, BufferGeometry, SphereGeometry,
  AxesHelper, Modifier, useScene,
  AmbientLight, PointLight,
  Points, PointsMaterial,
  PerspectiveCamera, OrbitControls
} from '@lancercomet/dancefloor'
import { defineComponent } from 'vue'
import { useResize } from '../../../hooks/resize'

const TestPage = defineComponent({
  name: 'TestPage',
  setup () {
    const { Scene, resize } = useScene()

    const count = 500000
    const areaSize = 50
    const positions = new Float32Array(count * 3)
    for (let i = 0, length = positions.length; i < length; i++) {
      positions[i] = Math.random() * areaSize * (Math.random() > 0.5 ? 1 : -1)
    }

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    const SphereParticle = () => (
      <Points>
        <SphereGeometry radius={5} />
        <PointsMaterial params={{
          size: 0.1,
          sizeAttenuation: true,
          transparent: true,
          depthWrite: false
        }} />
      </Points>
    )

    const WaveParticles = () => (
      <Points>
        <BufferGeometry>
          <BufferAttribute name='position' array={positions} itemSize={3} />
          <Modifier onTick={({ clock, geometry }) => {
            if (!clock || !geometry) {
              return
            }
            const elapsedTime = clock.getElapsedTime()
            for (let i = 0; i < count; i++) {
              const index = i * 3
              const x = geometry.attributes.position.array[index]
              const y = Math.sin(elapsedTime + x)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              geometry.attributes.position.array[index + 1] = y
            }

            geometry.attributes.position.needsUpdate = true
          }} />
        </BufferGeometry>
        <PointsMaterial
          params={{
            size: 0.01,
            sizeAttenuation: true,
            transparent: true,
            depthWrite: false
          }}
        />
      </Points>
    )

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <SphereParticle />
        <WaveParticles />
        <AmbientLight />
        <PointLight castShadow showHelper position={{ x: 4, y: 4, z: 4 }} />
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  TestPage
}
