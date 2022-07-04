import { Group } from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
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
    const container = injectContainer()
    let model: Group
    let emitOnLoad = false

    const unloadModel = () => {
      if (model) {
        model.children.forEach(item => item.removeFromParent())
        model.removeFromParent()
      }
    }

    const initModel = async () => {
      const { objUrl, mtlUrl } = props
      if (!objUrl || !mtlUrl) {
        return
      }

      const mtlLoader = new MTLLoader()
      const material = await mtlLoader.loadAsync(mtlUrl)
      material.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(material)

      unloadModel()

      model = await objLoader.loadAsync(objUrl)

      container?.add(model)
    }

    const revoke = watch(props, async (newValue, oldValue) => {
      const { objUrl, mtlUrl } = newValue
      if (!objUrl || !mtlUrl) {
        return
      }

      const isUrlChanged = objUrl !== oldValue?.objUrl ||
        mtlUrl !== oldValue?.mtlUrl

      if (isUrlChanged) {
        await initModel()
        emitOnLoad = true
      }

      const isPositionChanged = newValue.position?.x !== model.position.x ||
        newValue.position?.y !== model.position.y ||
        newValue.position?.z !== model.position.z

      if (isPositionChanged) {
        model.position.set(props.position.x ?? 0, props.position?.y ?? 0, props.position.z ?? 0)
      }

      const isScaleChanged = newValue.scale?.x !== model.scale.x ||
        newValue.scale?.y !== model.scale.y ||
        newValue.scale?.z !== model.scale.z

      if (isScaleChanged) {
        model.scale.set(props.scale.x ?? 1, props.scale?.y ?? 1, props.scale.z ?? 1)
      }

      const isShadowChanged = newValue.castShadow !== model.castShadow ||
        newValue.receiveShadow !== model.receiveShadow

      if (isShadowChanged) {
        setObjectShadow(model, props.castShadow === true, props.receiveShadow === true)
      }

      if (emitOnLoad) {
        emit('load', model)
        emitOnLoad = false
      }
    }, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      revoke()
      unloadModel()
    })

    return () => (
      <div class='obj-model' />
    )
  }
})

export {
  ObjModel
}
