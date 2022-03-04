import { Group } from 'three'
import { defineComponent, onMounted, PropType, watch } from 'vue'
import { injectContainer, provideContainer } from './providers/container'

const useGroup = () => {
  const group = new Group()
  const container = injectContainer()
  if (container) {
    container.add(group)
  }
  provideContainer(group)

  return {
    Group: defineComponent({
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
        const setProps = () => {
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
        }

        watch(props, setProps, {
          deep: true,
          immediate: true
        })

        onMounted(() => {
          emit('update', group)
        })

        return () => (
          <div class='three-group' data-uid={group.uuid}>{ slots.default?.() }</div>
        )
      }
    })
  }
}

export {
  useGroup
}
