import {
  BasicMaterial, PointsMaterial,
  OrbitControls, PerspectiveCamera, useScene,
  BoxGeometry, Mesh, Points, BufferGeometry, BufferAttribute, Modifier
} from '@lancercomet/dancefloor'
import * as THREE from 'three'
import { defineComponent } from 'vue'
import { useResize } from '../../hooks/resize'

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

const Particles = defineComponent({
  name: 'Particles',
  setup () {
    const { Scene, resize } = useScene({
      antialias: true
    })

    const particleCount = 500000
    const areaSize = 50
    const position = new Float32Array(particleCount * 3)
    for (let i = 0, length = position.length; i < length; i++) {
      position[i] = Math.random() * areaSize * (Math.random() > 0.5 ? 1 : -1)
    }

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene background={0x000000}>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <Points>
          <BufferGeometry>
            <BufferAttribute name='position' array={position} itemSize={3} />
            <Modifier onTick={({ geometry, clock }) => {
              if (!geometry || !clock) {
                return
              }
              const elapsedTime = clock.getElapsedTime()
              for (let i = 0; i < particleCount; i++) {
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
          <PointsMaterial params={{
            size: 0.1,
            sizeAttenuation: true,
            color: 0xffffff,
            map: particleTexture,
            transparent: true,
            alphaMap: particleTexture,
            depthWrite: false
          }} />
        </Points>

         <Points>
          <BoxGeometry width={3} height={3} depth={3} widthSegments={32} heightSegments={32} depthSegments={32} />
          <PointsMaterial params={{
            size: 0.1,
            sizeAttenuation: true,
            color: 0xffffff,
            map: particleTexture,
            transparent: true,
            alphaMap: particleTexture,
            depthWrite: false
          }} />
         </Points>

         <Mesh>
          <BoxGeometry />
          <BasicMaterial />
         </Mesh>
      </Scene>
    )
  }
})

export {
  Particles
}
