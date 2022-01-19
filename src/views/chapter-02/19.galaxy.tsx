import { AdditiveBlending, BufferAttribute, Color, PerspectiveCamera, Vector3 } from 'three'
import { computed, defineComponent, ref, watch } from 'vue'
import { useBufferGeometry } from '../../core.v2/geometries'
import { usePointsMaterial } from '../../core.v2/materials'
import { usePoints } from '../../core.v2/points'
import { useScene } from '../../core.v2/scene'

const Galaxy = defineComponent({
  name: 'Galaxy',
  setup () {
    const { Scene, gui, camera, onTick } = useScene({
      useControl: false
    })
    const { PointsMaterial } = usePointsMaterial()
    const { Points } = usePoints()
    const { BufferGeometry, setAttribute } = useBufferGeometry()

    const configRef = ref({
      size: 0.02,
      count: 10000,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    })

    const updateGalaxy = () => {
      const count = configRef.value.count
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const insideColor = new Color(configRef.value.insideColor)
      const outsideColor = new Color(configRef.value.outsideColor)
      for (let i = 0; i < count; i++) {
        const index = i * 3
        const radius = Math.random() * configRef.value.radius
        const branchAngle = (i % configRef.value.branches) / configRef.value.branches * Math.PI * 2
        const spinAngle = radius * configRef.value.spin

        const randomnessPower = configRef.value.randomnessPower
        const randomness = configRef.value.randomness
        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius

        positions[index] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[index + 1] = randomY
        positions[index + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / configRef.value.radius)

        colors[index] = mixedColor.r
        colors[index + 1] = mixedColor.g
        colors[index + 2] = mixedColor.b
      }
      setAttribute('position', new BufferAttribute(positions, 3))
      setAttribute('color', new BufferAttribute(colors, 3))
    }

    watch(configRef.value, updateGalaxy, {
      immediate: true
    })

    const materialParam = computed(() => ({
      size: configRef.value.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true
    }))

    Object.keys(configRef.value).forEach(key => {
      if (/color/i.test(key)) {
        gui.addColor(configRef.value, key)
      } else {
        gui.add(configRef.value, key)
      }
    })

    let angle = 0
    const radius = 8
    onTick(() => {
      // Use Math.cos and Math.sin to set camera X and Z values based on angle.
      camera.position.x = radius * Math.cos(angle)
      camera.position.z = radius * Math.sin(angle)
      camera.lookAt(new Vector3(0, 0, 0))
      angle += 0.001
    })

    const Galaxy = () => (
      <Points>
        <BufferGeometry/>
        <PointsMaterial params={materialParam.value}/>
      </Points>
    )

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
