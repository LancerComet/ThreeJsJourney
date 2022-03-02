import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { injectContainer } from './providers/container'
import { setObjectShadow } from './utils/objects'

const ObjModel = defineComponent({
  name: 'ObjModel',

  props: {
    objUrl: {
      type: String as PropType<string>
    },

    mtlUrl: {
      type: String as PropType<string>
    },

    castShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    },

    receiveShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    },

    position: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({ x: 0, y: 0, z: 0 })
    },

    scale: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({ x: 1, y: 1, z: 1 })
    }
  },

  emits: ['load'],

  setup (props, { emit }) {
    const uuidRef = ref('')
    const container = injectContainer()

    const init = async () => {
      const { objUrl, mtlUrl } = props
      if (!objUrl || !mtlUrl) {
        return
      }

      const mtlLoader = new MTLLoader()
      const material = await mtlLoader.loadAsync(mtlUrl)
      material.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(material)

      const model = await objLoader.loadAsync(objUrl)

      model.position.set(props.position.x ?? 0, props.position?.y ?? 0, props.position.z ?? 0)
      model.scale.set(props.scale.x ?? 1, props.scale?.y ?? 1, props.scale.z ?? 1)
      setObjectShadow(model, props.castShadow === true, props.receiveShadow === true)

      container?.add(model)
      uuidRef.value = model.uuid

      emit('load', model)
    }

    watch(props, init, {
      deep: true,
      immediate: true
    })

    return () => (
      <div class='obj-model' data-uuid={uuidRef.value} />
    )
  }
})

export {
  ObjModel
}
