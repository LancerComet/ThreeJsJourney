import * as THREE from 'three'
import { defineComponent, inject, onBeforeUnmount, onMounted, PropType, provide, ref, watch, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'

const injectKeyGetPoint = 'three:point:getPoint'

const Points = defineComponent({
  name: 'Points',

  props: {
    receiveShadow: Boolean as PropType<boolean>,
    castShadow: Boolean as PropType<boolean>,
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    }
  },

  emits: ['mounted'],

  setup (props, { slots, emit }) {
    const points = new THREE.Points()
    const container = injectContainer()
    container?.add(points)

    const getPoint = () => {
      return points
    }
    provide(injectKeyGetPoint, getPoint)

    const setPositionRotation = () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'

        const positionValue = props.position?.[key] ?? 0
        if (positionValue !== points.position[key]) {
          points.position[key] = positionValue
        }

        const rotationValue = props.rotation?.[key] ?? 0
        if (rotationValue !== points.rotation[key]) {
          points.rotation[key] = rotationValue
        }
      })
    }

    const setProps = () => {
      points.castShadow = props.castShadow === true
      points.receiveShadow = props.receiveShadow === true
      setPositionRotation()
    }

    const revoke = watchEffect(() => {
      setProps()
    })

    onMounted(() => {
      emit('mounted')
    })

    onBeforeUnmount(() => {
      revoke()
      points.clear()
      points.removeFromParent()
    })

    return () => (
      <div class='points'>{ slots.default?.() }</div>
    )
  }
})

const injectGetPoints = () => {
  return inject<() => THREE.Points | undefined>(injectKeyGetPoint, () => {
    console.warn('You should call this under <Point />.')
    return undefined
  })
}

export {
  Points,
  injectGetPoints
}
