import { AxesHelper } from 'three'
import { defineComponent, PropType, watch } from 'vue'
import { getScene } from './scene'
import { isNumber } from './utils'

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
          if (isNumber(props.position.x)) { axesHelper.position.x = props.position.x }
          if (isNumber(props.position.y)) { axesHelper.position.y = props.position.y }
          if (isNumber(props.position.z)) { axesHelper.position.z = props.position.z }
          if (isNumber(props.rotation.x)) { axesHelper.rotation.x = props.rotation.x }
          if (isNumber(props.rotation.y)) { axesHelper.rotation.y = props.rotation.y }
          if (isNumber(props.rotation.z)) { axesHelper.rotation.z = props.rotation.z }
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
