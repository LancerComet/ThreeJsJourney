import * as THREE from 'three'
import { BufferAttribute } from 'three'
import { defineComponent } from 'vue'
import { useBufferGeometry, useSphereGeometry } from '../../core.v2/geometries'
import { useAxesHelper } from '../../core.v2/helpers'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { usePointsMaterial } from '../../core.v2/materials'
import { usePoints } from '../../core.v2/points'
import { useScene } from '../../core.v2/scene'

const TestPage = defineComponent({
  name: 'TestPage',
  setup () {
    const { Scene } = useScene({
      useControl: true
    })
    const { SphereGeometry } = useSphereGeometry()
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    const { AxesHelper } = useAxesHelper()
    const { Points } = usePoints()
    const { PointsMaterial } = usePointsMaterial()

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

    const WaveParticles = () => {
      const { BufferGeometry, geometry } = useBufferGeometry()

      const count = 500000
      const areaSize = 50
      const positions = new Float32Array(count * 3)
      for (let i = 0, length = positions.length; i < length; i++) {
        positions[i] = Math.random() * areaSize * (Math.random() > 0.5 ? 1 : -1)
      }
      geometry.setAttribute('position', new BufferAttribute(positions, 3))

      const clock = new THREE.Clock()
      const tick = () => {
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
        requestAnimationFrame(tick)
      }
      tick()

      return (
        <Points>
          <BufferGeometry />
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
    }

    return () => (
      <Scene>
        <SphereParticle />
        <WaveParticles />
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
