import * as THREE from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { defineComponent, onMounted, ref } from 'vue'
import { BoxGeometry, BasicMaterial, Mesh, useScene } from '../../../packages/dancefloor/lib'

const Textures = defineComponent({
  name: 'Texture',
  setup () {
    const { Scene } = useScene()
    const materialParam = ref<MeshBasicMaterialParameters>({})

    onMounted(async () => {
      const textureLoader = new THREE.TextureLoader()
      const colorTexture = await textureLoader.loadAsync('/textures/door/color.jpg')
      colorTexture.needsUpdate = true
      colorTexture.minFilter = THREE.NearestFilter
      materialParam.value = {
        map: colorTexture
      }
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
          <BoxGeometry width={1} height={1} depth={1} />
          <BasicMaterial params={materialParam.value}/>
        </Mesh>
      </Scene>
    )
  }
})

export {
  Textures
}
