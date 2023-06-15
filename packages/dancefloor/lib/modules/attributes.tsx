import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectGeometry } from '../providers/geometry'

/**
 * BufferAttribute is used for setting buffer attributes for geometries.
 *
 * @example
 * <BufferGeometry>
 *   <BufferAttribute name='position' array={positions} itemSize={3} />
 * </BufferGeometry>
 */
const BufferAttribute = defineComponent({
  name: 'BufferAttribute',

  props: {
    name: {
      type: String as PropType<string>,
      required: true
    },
    array: {
      type: Object as PropType<ArrayLike<number>>,
      required: true
    },
    itemSize: {
      type: Number as PropType<number>,
      required: true
    },
    normalized: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  setup (props) {
    let attribute = new THREE.BufferAttribute(props.array, props.itemSize, props.normalized)
    let lastAttrName = props.name

    const geometry = injectGeometry()
    if (geometry) {
      geometry.setAttribute(lastAttrName, attribute)
    }

    const updateAttribute = () => {
      if (!geometry) {
        return
      }

      const newAttrName = props.name
      if (newAttrName !== lastAttrName) {
        geometry.deleteAttribute(lastAttrName)
        attribute = new THREE.BufferAttribute(props.array, props.itemSize, props.normalized)
        geometry.setAttribute(newAttrName, attribute)
        lastAttrName = newAttrName
        return
      }

      // @ts-ignore
      geometry.attributes[newAttrName].array = props.array
      geometry.attributes[newAttrName].itemSize = props.itemSize
      geometry.attributes[newAttrName].normalized = props.normalized
      geometry.attributes[newAttrName].needsUpdate = true
    }

    const revoke = watchEffect(updateAttribute)

    onBeforeUnmount(() => {
      revoke()
    })

    return () => (
      <div class='buffer-attribute' />
    )
  }
})

export {
  BufferAttribute
}
