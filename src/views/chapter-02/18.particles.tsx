import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry, Clock, Color, Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  SphereGeometry,
  TextureLoader
} from 'three'
import { defineComponent } from 'vue'
import { useScene } from '../../core.v2/scene'

const Particles = defineComponent({
  name: 'Particles',
  setup () {
    const { Scene, scene, onTick } = useScene({
      antialias: true
    })

    const textureLoader = new TextureLoader()
    const particleTexture = textureLoader.load('/textures/particles/2.png')

    const particlesMaterial = new PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      color: 0xffffff,
      map: particleTexture,
      transparent: true,
      alphaMap: particleTexture,
      depthWrite: false
    })

    const sphere = new SphereGeometry(3, 32, 32)
    const sphereParticle = new Points(sphere, particlesMaterial)
    scene.add(sphereParticle)

    const bufferGeometry = new BufferGeometry()
    const count = 500000
    const areaSize = 50
    const positions = new Float32Array(count * 3)
    for (let i = 0, length = positions.length; i < length; i++) {
      positions[i] = Math.random() * areaSize * (Math.random() > 0.5 ? 1 : -1)
    }
    bufferGeometry.setAttribute('position', new BufferAttribute(positions, 3))

    const bufferParticle = new Points(bufferGeometry, particlesMaterial)
    scene.add(bufferParticle)

    const cube = new Mesh(
      new BoxGeometry(),
      new MeshBasicMaterial()
    )
    scene.add(cube)

    const clock = new Clock()
    onTick(() => {
      const elapsedTime = clock.getElapsedTime()
      // sphereParticle.rotation.y = elapsedTime * -0.2
      // bufferParticle.rotation.y = elapsedTime * 0.2

      for (let i = 0; i < count; i++) {
        const index = i * 3
        const x = bufferGeometry.attributes.position.array[index]
        const y = Math.sin(elapsedTime + x)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bufferGeometry.attributes.position.array[index + 1] = y
      }
      bufferGeometry.attributes.position.needsUpdate = true
    })

    return () => (
      <Scene background={new Color(0)} />
    )
  }
})

export {
  Particles
}
