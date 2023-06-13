import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import { injectContainer, provideContainer } from '../providers/container'

const Group = defineComponent({
  name: 'Group',

  props: {
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    scale: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
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
      const axes = ['x', 'y', 'z'] as ('x' | 'y' | 'z')[]
      for (const key of axes) {
        const newPosition = props.position?.[key] ?? 0
        const oldPosition = group.position[key]
        if (newPosition !== oldPosition) {
          group.position[key] = newPosition
        }
        const newRotation = props.rotation?.[key] ?? 0
        const oldRotation = group.rotation[key]
        if (newRotation !== oldRotation) {
          group.rotation[key] = newRotation
        }
        const newScale = props.scale?.[key] ?? 0
        const oldScale = group.scale[key]
        if (newScale !== oldScale) {
          group.scale[key] = newScale
        }
      }
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
