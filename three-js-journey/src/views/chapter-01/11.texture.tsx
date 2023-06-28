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
    const controlSpaceRef = ref<'local' | 'world'>('local')
    const snapRef = ref<{ t: null | number, s: null | number, r: null | number }>({ t: null, s: null, r: null })

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (key === 'Shift') {
        snapRef.value = {
          t: 1,
          s: 1,
          r: THREE.MathUtils.degToRad(45)
        }
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key
      switch (key) {
        case 'v':
          controlModeRef.value = 'translate'
          break
        case 's':
          controlModeRef.value = 'scale'
          break
        case 'r':
          controlModeRef.value = 'rotate'
          break
        case 'q':
          controlSpaceRef.value = controlSpaceRef.value === 'local'
            ? 'world'
            : 'local'
          break
        case 'Shift':
          snapRef.value = {
            t: null, s: null, r: null
          }
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

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeyDown)
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
              space={controlSpaceRef.value}
              snap={snapRef.value}
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
