import { AdditiveBlending, BufferAttribute } from 'three'
import { computed, defineComponent, ref } from 'vue'
import { useBufferGeometry } from '../../core.v2/geometries'
import { usePointsMaterial } from '../../core.v2/materials'
import { usePoints } from '../../core.v2/points'
import { useScene } from '../../core.v2/scene'

const Galaxy = defineComponent({
  name: 'Galaxy',
  setup () {
    const { Scene, gui } = useScene()
    const configRef = ref({
      size: 0.02,
      radius: 5
    })

    gui.add(configRef.value, 'size')

    const Galaxy = (() => {
      const { BufferGeometry, setAttribute } = useBufferGeometry()
      const count = 1000
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const index = i * 3
        const radius = Math.random() * configRef.value.radius
        positions[index] = radius
        positions[index + 1] = (Math.random() - 0.5) * 3 // -1.5 - 1.5
        positions[index + 2] = (Math.random() - 0.5) * 3 // -1.5 - 1.5
      }
      setAttribute('position', new BufferAttribute(positions, 3))

      const { PointsMaterial } = usePointsMaterial()
      const { Points } = usePoints()

      const materialParam = computed(() => ({
        size: configRef.value.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending
      }))

      return () => (
        <Points>
          <BufferGeometry/>
          <PointsMaterial params={materialParam.value}/>
        </Points>
      )
    })()

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
