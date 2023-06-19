import {
  BoxGeometry,
  BasicMaterial,
  Mesh,
  useScene,
  PerspectiveCamera,
  OrbitControls,
  TransformControls, AxesHelper, GridHelper
} from '@lancercomet/dancefloor'
import * as THREE from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { useResize } from '../../hooks/resize'

const Textures = defineComponent({
  name: 'Texture',
  setup () {
    const { Scene, resize } = useScene()
    const materialParamsRef = ref<MeshBasicMaterialParameters>({})
    const isOrbitControlEnabled = ref(true)
    const controlModeRef = ref<'translate' | 'scale' | 'rotate'>('translate')

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key
      switch (key) {
        case 't':
          controlModeRef.value = 'translate'
          break
        case 's':
          controlModeRef.value = 'scale'
          break
        case 'r':
          controlModeRef.value = 'rotate'
          break
      }
    }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.loadAsync('/textures/door/color.jpg')
      .then(colorTexture => {
        colorTexture.minFilter = THREE.NearestFilter
        materialParamsRef.value.map = colorTexture

        // Repeat texture.
        // ===
        // colorTexture.repeat.x = 2
        // colorTexture.wrapS = RepeatWrapping

        // colorTexture.repeat.y = 2
        // colorTexture.wrapT = RepeatWrapping
      })

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    window.addEventListener('keyup', onKeyUp)

    onBeforeUnmount(() => {
      window.removeEventListener('keyup', onKeyUp)
    })

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls enabled={isOrbitControlEnabled.value} />
          <Mesh>
            <BoxGeometry width={1} height={1} depth={1} />
            <BasicMaterial params={materialParamsRef.value} />
            <TransformControls
              mode={controlModeRef.value}
              onDraggingChanged={event => {
                const isInDragging = event.value
                isOrbitControlEnabled.value = !isInDragging
              }}
            />
          </Mesh>
        </PerspectiveCamera>

        <AxesHelper />
        <GridHelper />
      </Scene>
    )
  }
})

export {
  Textures
}
