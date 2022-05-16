import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { injectContainer } from './providers/container'

const AxesHelper = defineComponent({
  props: {
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    }
  },

  setup (props) {
    const axesHelper = new THREE.AxesHelper()
    const container = injectContainer()
    container?.add(axesHelper)

    const setProps = () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'

        const positionValue = props.position?.[key] ?? 0
        if (positionValue !== axesHelper.position[key]) {
          axesHelper.position[key] = positionValue
        }

        const rotationValue = props.rotation?.[key] ?? 0
        if (rotationValue !== axesHelper.rotation[key]) {
          axesHelper.rotation[key] = rotationValue
        }
      })
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(revoke)

    return () => (
      <div class='axes-helper' data-uuid={axesHelper.uuid} />
    )
  }
})

export {
  AxesHelper
}
