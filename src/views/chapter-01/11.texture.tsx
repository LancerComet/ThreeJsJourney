import { BoxGeometry, Mesh, NearestFilter, TextureLoader } from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { defineComponent, ref } from 'vue'
import { useBoxGeometry } from '../../core.v2/geometries'
import { useBasicMaterial } from '../../core.v2/materials'
import { useMesh } from '../../core.v2/mesh'
import { useScene } from '../../core.v2/scene'

const Textures = defineComponent({
  name: 'Texture',
  setup () {
    const { Scene } = useScene()
    const { Mesh } = useMesh()
    const { BoxGeometry } = useBoxGeometry()
    const { BasicMaterial } = useBasicMaterial()
    const materialParam = ref<MeshBasicMaterialParameters>({})

    const textureLoader = new TextureLoader()
    textureLoader.loadAsync('/textures/door/color.jpg')
      .then(colorTexture => {
        colorTexture.needsUpdate = true
        colorTexture.minFilter = NearestFilter
        materialParam.value.map = colorTexture
      })

    // Repeat texture.
    // ===
    // colorTexture.repeat.x = 2
    // colorTexture.wrapS = RepeatWrapping

    // colorTexture.repeat.y = 2
    // colorTexture.wrapT = RepeatWrapping

    return () => (
      <Scene>
        <Mesh>
          <BoxGeometry/>
          <BasicMaterial params={materialParam.value}/>
        </Mesh>
      </Scene>
    )
  }
})

export {
  Textures
}
