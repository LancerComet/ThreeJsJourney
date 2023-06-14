import * as THREE from 'three'
import { BufferGeometry, Material } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideMesh } from '../providers/mesh'

const Mesh = defineComponent({
  name: 'Mesh',

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

    scale: {
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
    const mesh = new THREE.Mesh()
    provideMesh(mesh)

    const container = injectContainer()
    container?.add(mesh)

    const setProps = () => {
      if (mesh.castShadow !== props.castShadow) {
        mesh.castShadow = props.castShadow === true
      }

      if (mesh.receiveShadow !== props.receiveShadow) {
        mesh.receiveShadow = props.receiveShadow === true
      }

      if (props.geometry) {
        mesh.geometry = props.geometry
      }
      if (props.material) {
        mesh.material = props.material
      }

      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'

        const positionValue = props.position?.[key] ?? 0
        if (positionValue !== mesh.position[key]) {
          mesh.position[key] = positionValue
        }

        const rotationValue = props.rotation?.[key] ?? 0
        if (rotationValue !== mesh.rotation[key]) {
          mesh.rotation[key] = rotationValue
        }

        const scaleValue = props.scale?.[key] ?? 1
        if (scaleValue !== mesh.scale[key]) {
          mesh.scale[key] = scaleValue
        }
      })
    }

    const revoke = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      revoke()
      mesh.clear()
      mesh.removeFromParent()
      container?.remove(mesh)
    })

    return () => (
      <div class='mesh' data-uuid={mesh.uuid}>{ slots.default?.() }</div>
    )
  }
})

export {
  Mesh
}
