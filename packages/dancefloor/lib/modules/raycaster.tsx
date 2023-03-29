import * as THREE from 'three'
import { ComponentPublicInstance, defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'

const RayCaster = defineComponent({
  props: {
    origin: {
      type: Object as PropType<THREE.Vector3>
    },
    direction: {
      type: Object as PropType<THREE.Vector3>
    }
  },

  setup (props, { expose }) {
    const rayCaster = new THREE.Raycaster()

    const revoke = watchEffect(() => {
      const origin = props.origin
      const direction = props.direction
      if (origin && direction) {
        rayCaster.set(origin, direction)
      }
    })

    expose({
      getRayCaster: () => rayCaster
    })

    onBeforeUnmount(revoke)

    return () => (
      <div class='ray-caster' />
    )
  }
})

type RayCasterComponent = ComponentPublicInstance<{
  origin: PropType<THREE.Vector3>
  direction: PropType<THREE.Vector3>
}, {
  getRayCaster: () => THREE.Raycaster
}>

export {
  RayCaster,
  RayCasterComponent
}
