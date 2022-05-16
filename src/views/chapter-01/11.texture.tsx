import * as THREE from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { defineComponent, ref } from 'vue'
import { BoxGeometry } from '../../core.v2/geometries'
import { BasicMaterial } from '../../core.v2/materials'
import { Mesh } from '../../core.v2/mesh'
import { useScene } from '../../core.v2/scene'

const Textures = defineComponent({
  name: 'Texture',
  setup () {
    const { Scene } = useScene()
    const materialParam = ref<MeshBasicMaterialParameters>({})

    const textureLoader = new THREE.TextureLoader()
    textureLoader.loadAsync('/textures/door/color.jpg')
      .then(colorTexture => {
        colorTexture.needsUpdate = true
        colorTexture.minFilter = THREE.NearestFilter
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
