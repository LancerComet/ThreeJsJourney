import { MeshStandardMaterial, PointsMaterial, PointsMaterialParameters } from 'three'
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getSetMaterial } from './mesh'
import { getSetPointsMaterial } from './points'

const useStandardMaterial = () => {
  const StandardMaterial = defineComponent({
    props: {
      params: Object as PropType<MeshStandardMaterialParameters>
    },

    setup (props) {
      let material: MeshStandardMaterial
      const setMaterial = getSetMaterial()

      const createMaterial = () => {
        dispose()
        material = new MeshStandardMaterial(props.params)
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

const usePointsMaterial = () => {
  return {
    PointsMaterial: defineComponent({
      props: {
        params: Object as PropType<PointsMaterialParameters>
      },

      setup (props) {
        let material: PointsMaterial
        const setMaterial = getSetPointsMaterial()

        const createMaterial = () => {
          dispose()
          material = new PointsMaterial(props.params)
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
          <div class='points-material' data-uuid={material?.uuid} />
        )
      }
    })
  }
}

export {
  useStandardMaterial,
  usePointsMaterial
}
