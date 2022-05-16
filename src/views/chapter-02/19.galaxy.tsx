import { AdditiveBlending, BufferAttribute, Color, Vector3 } from 'three'
import { defineComponent, onMounted, ref } from 'vue'
import { BufferGeometry, BufferGeometryComponent } from '../../core.v2/geometries'
import { PointsMaterial } from '../../core.v2/materials'
import { Points } from '../../core.v2/points'
import { useScene } from '../../core.v2/scene'

const Galaxy = defineComponent({
  name: 'Galaxy',
  setup () {
    const { Scene, gui, camera, onTick } = useScene({
      useControl: true
    })
    const bufferGeometryRef = ref<BufferGeometryComponent>()

    const galaxyConfig = {
      size: 0.02,
      count: 10000,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    }

    const initGalaxy = () => {
      const count = galaxyConfig.count
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const insideColor = new Color(galaxyConfig.insideColor)
      const outsideColor = new Color(galaxyConfig.outsideColor)
      for (let i = 0; i < count; i++) {
        const index = i * 3
        const radius = Math.random() * galaxyConfig.radius
        const branchAngle = (i % galaxyConfig.branches) / galaxyConfig.branches * Math.PI * 2
        const spinAngle = radius * galaxyConfig.spin

        const randomnessPower = galaxyConfig.randomnessPower
        const randomness = galaxyConfig.randomness
        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius

        positions[index] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[index + 1] = randomY
        positions[index + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / galaxyConfig.radius)

        colors[index] = mixedColor.r
        colors[index + 1] = mixedColor.g
        colors[index + 2] = mixedColor.b
      }

      bufferGeometryRef.value?.setAttributes({
        position: new BufferAttribute(positions, 3),
        color: new BufferAttribute(colors, 3)
      })
    }

    // Setup GUI.
    Object.keys(galaxyConfig).forEach(key => {
      if (/color/i.test(key)) {
        gui.addColor(galaxyConfig, key)
      } else {
        gui.add(galaxyConfig, key)
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

    onMounted(() => {
      initGalaxy()
    })

    return () => (
      <Scene>
        <Points>
          <BufferGeometry ref={bufferGeometryRef} />
          <PointsMaterial params={{
            size: galaxyConfig.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true
          }}/>
        </Points>
      </Scene>
    )
  }
})

export {
  Galaxy
}
