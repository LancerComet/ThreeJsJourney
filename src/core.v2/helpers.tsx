import { AxesHelper } from 'three'
import { defineComponent, PropType, watch } from 'vue'
import { getScene } from './scene'

const useAxesHelper = () => {
  return {
    AxesHelper: defineComponent({
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
        const axesHelper = new AxesHelper()
        const scene = getScene()
        scene?.add(axesHelper)

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

        watch(props, setProps, {
          deep: true,
          immediate: true
        })

        return () => (
          <div class='axes-helper' data-uuid={axesHelper.uuid} />
        )
      }
    })
  }
}

export {
  useAxesHelper
}
