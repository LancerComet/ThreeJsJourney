import { MeshStandardMaterial } from 'three'
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getSetMaterial } from './mesh'

const useStandardMaterial = () => {
  const StandardMaterial = defineComponent({
    props: {
      config: Object as PropType<MeshStandardMaterialParameters>
    },

    setup (props) {
      let material: MeshStandardMaterial
      const setMaterial = getSetMaterial()

      const createMaterial = () => {
        dispose()
        material = new MeshStandardMaterial()
        setMaterial(material)
      }

      const dispose = () => {
        material?.dispose()
      }

      onBeforeUnmount(dispose)

      watch(props, createMaterial, {
        deep: true,
        immediate: true
      })

      return () => (
        <div class='standard-material' data-uuid={material?.uuid} />
      )
    }
  })

  return {
    StandardMaterial
  }
}

export {
  useStandardMaterial
}
