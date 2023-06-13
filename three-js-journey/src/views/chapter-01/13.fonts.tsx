import {
  AxesHelper, Mesh, OrbitControls, PerspectiveCamera, useScene, TextGeometry,
  MatcapMaterial, AmbientLight
} from '@lancercomet/dancefloor'
import { Texture, TextureLoader } from 'three'
import * as THREE from 'three'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { computed, defineComponent, ref } from 'vue'
import { useResize } from '../../hooks/resize'

// Use this to convert a regular font into the TypeFace font.
// http://gero3.github.io/facetype.js/
const Fonts = defineComponent({
  name: 'Fonts',

  setup () {
    const { Scene, onTick, resize } = useScene()
    const fontLoader = new FontLoader()

    const emptyTexture = new Texture()
    const texture1Ref = ref<Texture>(emptyTexture)
    const texture2Ref = ref<Texture>(emptyTexture)
    const texture3Ref = ref<Texture>(emptyTexture)
    const texture = computed(() => {
      const textures = [texture1Ref.value, texture2Ref.value, texture3Ref.value]
      const index = Math.floor(Math.random() * textures.length)
      return textures[index]
    })

    const showDonutRef = ref(false)

    const fontRef = ref<Font>()
    fontLoader.loadAsync('/fonts/kenpixel.json')
      .then(font => {
        fontRef.value = font
      })

    const textureLoader = new TextureLoader()
    Promise.all([
      textureLoader.loadAsync('/textures/matcaps/1.png'),
      textureLoader.loadAsync('/textures/matcaps/2.png'),
      textureLoader.loadAsync('/textures/matcaps/3.png')
    ]).then((value: Texture[]) => {
      const [t1, t2, t3] = value
      texture1Ref.value = t1
      texture2Ref.value = t2
      texture3Ref.value = t3
      showDonutRef.value = true
    })

    const Text = () => (
      <Mesh>
        <TextGeometry
          text='This is sparta!' font={fontRef.value}
          size={0.5} height={0.5} curveSegments={12}
          computeBoundingBox centered
        />
        <MatcapMaterial params={{ matcap: texture.value }}/>
      </Mesh>
    )

    const Donuts = () => {
      const genCount = 1000
      const generatingDistance = 80
      const geometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
      const material = new THREE.MeshMatcapMaterial({
        matcap: texture.value
      })

      return <>
        {
          new Array(genCount).fill(0).map((_, i) => {
            const position = {
              x: (Math.random() - 0.5) * generatingDistance,
              y: (Math.random() - 0.5) * generatingDistance,
              z: (Math.random() - 0.5) * generatingDistance
            }
            const rotation = {
              x: Math.random() * Math.PI,
              y: Math.random() * Math.PI
            }
            const scale = Math.random()
            return (
              <Mesh
                position={position} rotation={rotation} scale={{ x: scale, y: scale, z: scale }}
                geometry={geometry} material={material}
              />
            )
          })
        }
      </>
    }

    let angle = 0
    const radius = 8
    const cameraPositionRef = ref({
      x: 5, y: 0, z: 5
    })
    const cameraLookAtRef = ref({
      x: 0, y: 0, z: 0
    })

    onTick(() => {
      // Use Math.cos and Math.sin to set camera X and Z values based on angle.
      cameraPositionRef.value.x = radius * Math.cos(angle)
      cameraPositionRef.value.z = radius * Math.sin(angle)
      cameraPositionRef.value = {
        x: 0, y: 0, z: 0
      }
      angle += 0.005
    })

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }} lookAt={cameraLookAtRef.value}>
          <OrbitControls />
        </PerspectiveCamera>

        <Text />
        { showDonutRef.value ? <Donuts /> : undefined }
        <AxesHelper />
        <AmbientLight color={0xffffff} intensity={0.5} />
      </Scene>
    )
  }
})

export {
  Fonts
}
