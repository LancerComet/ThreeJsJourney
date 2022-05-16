import { Raycaster, Vector3 } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'

const useRayCaster = () => {
  const rayCaster = new Raycaster()

  return {
    rayCaster,
    RayCaster: defineComponent({
      props: {
        origin: {
          type: Object as PropType<Vector3>
        },
        direction: {
          type: Object as PropType<Vector3>
        }
      },
      setup (props) {
        const revoke = watch(props, () => {
          const { origin, direction } = props
          if (origin && direction) {
            rayCaster.set(origin, direction)
          }
        }, {
          immediate: true
        })

        onBeforeUnmount(revoke)

        return () => (
          <div class='ray-caster' />
        )
      }
    })
  }
}

export {
  useRayCaster
}
