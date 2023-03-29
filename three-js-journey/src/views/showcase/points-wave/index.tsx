import { BufferGeometry, BufferGeometryComponent, SphereGeometry, AxesHelper, AmbientLight, PointLight, PointsMaterial, Points, useScene } from '@lancercomet/dancefloor'
import * as THREE from 'three'
import { BufferAttribute } from 'three'
import { defineComponent, onMounted, ref } from 'vue'

const TestPage = defineComponent({
  name: 'TestPage',
  setup () {
    const { Scene } = useScene({
      useControl: true
    })
    const geometryRef = ref<BufferGeometryComponent>()

    const init = () => {
      const count = 500000
      const areaSize = 50
      const positions = new Float32Array(count * 3)
      for (let i = 0, length = positions.length; i < length; i++) {
        positions[i] = Math.random() * areaSize * (Math.random() > 0.5 ? 1 : -1)
      }

      const geometry = geometryRef.value?.getGeometry()
      if (!geometry) {
        return
      }

      geometry.attributes.position = new BufferAttribute(positions, 3)

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
    }

    onMounted(() => init())

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
        <BufferGeometry ref={geometryRef} />
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
