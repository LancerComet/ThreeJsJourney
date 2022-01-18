import { AdditiveBlending, BufferAttribute } from 'three'
import { defineComponent } from 'vue'
import { useBufferGeometry } from '../../core.v2/geometries'
import { usePointsMaterial } from '../../core.v2/materials'
import { usePoints } from '../../core.v2/points'
import { useScene } from '../../core.v2/scene'

const Galaxy = defineComponent({
  name: 'Galaxy',
  setup () {
    const { Scene } = useScene()

    const Galaxy = () => {
      const { BufferGeometry, setAttribute } = useBufferGeometry()
      const count = 1000
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const index = i * 3
        positions[index] = (Math.random() - 0.5) * 3 // -1.5 - 1.5
        positions[index + 1] = (Math.random() - 0.5) * 3 // -1.5 - 1.5
        positions[index + 2] = (Math.random() - 0.5) * 3 // -1.5 - 1.5
      }
      setAttribute('position', new BufferAttribute(positions, 3))

      const { PointsMaterial } = usePointsMaterial()
      const { Points } = usePoints()
      const size = 0.02

      return (
        <Points>
          <BufferGeometry />
          <PointsMaterial params={{
            size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: AdditiveBlending
          }} />
        </Points>
      )
    }

    return () => (
      <Scene>
        <Galaxy />
      </Scene>
    )
  }
})

export {
  Galaxy
}
