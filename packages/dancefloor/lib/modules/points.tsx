import * as THREE from 'three'
import { BufferGeometry, Material } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideMesh } from '../providers/mesh'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const Points = defineComponent({
  name: 'Points',

  props: {
    receiveShadow: Boolean as PropType<boolean>,
    castShadow: Boolean as PropType<boolean>,
    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<IVector3>>,
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
      updateVector3(props.position, points.position)
      updateVector3(props.rotation, points.rotation)
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
