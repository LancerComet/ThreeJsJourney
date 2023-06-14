import * as THREE from 'three'
import { BufferGeometry, Material } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideMesh } from '../providers/mesh'

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
    },
    geometry: {
      type: Object as PropType<BufferGeometry>
    },
    material: {
      type: Object as PropType<Material>
    }
  },

  setup (props, { slots }) {
    const points = new THREE.Points()
    provideMesh(points)

    const container = injectContainer()
    container?.add(points)

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

    const revoke = watchEffect(() => {
      points.castShadow = props.castShadow === true
      points.receiveShadow = props.receiveShadow === true

      if (props.material) {
        points.material = props.material
      }

      if (props.geometry) {
        points.geometry = props.geometry
      }

      setPositionRotation()
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

export {
  Points
}
