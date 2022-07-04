import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import { injectContainer, provideContainer } from './providers/container'

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
    }
  },

  emits: ['update'],

  setup (props, { slots, emit }) {
    const group = new THREE.Group()

    const container = injectContainer()
    if (container) {
      container.add(group)
    }
    provideContainer(group)

    let setPropsTimer: any = null

    const setProps = () => {
      clearTimeout(setPropsTimer)
      setPropsTimer = setTimeout(() => {
        ['x', 'y', 'z'].forEach(item => {
          const key = item as 'x' | 'y' | 'z'

          const positionValue = props.position?.[key] ?? 0
          if (positionValue !== group.position[key]) {
            group.position[key] = positionValue
          }

          const rotationValue = props.rotation?.[key] ?? 0
          if (rotationValue !== group.rotation[key]) {
            group.rotation[key] = rotationValue
          }
        })
      }, 10)
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    const removeSelf = () => {
      group.removeFromParent()
    }

    onMounted(() => {
      emit('update', group)
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
