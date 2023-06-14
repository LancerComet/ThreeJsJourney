import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import { injectContainer, provideContainer } from '../providers/container'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const Group = defineComponent({
  name: 'Group',

  props: {
    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },
    scale: {
      type: Object as PropType<IVector3>,
      default: () => ({ x: 1, y: 1, z: 1 })
    }
  },

  emits: ['mounted'],

  setup (props, { slots, emit }) {
    const group = new THREE.Group()

    const container = injectContainer()
    if (container) {
      container.add(group)
    }
    provideContainer(group)

    const setProps = () => {
      updateVector3(props.position, group.position)
      updateVector3(props.rotation, group.rotation)
      updateVector3(props.scale, group.scale)
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    const removeSelf = () => {
      group.removeFromParent()
    }

    onMounted(() => {
      emit('mounted', group)
    })

    onBeforeUnmount(() => {
      revoke()
      removeSelf()
    })

    return () => (
      <div class='three-group'>{ slots.default?.() }</div>
    )
  }
})

export {
  Group
}
