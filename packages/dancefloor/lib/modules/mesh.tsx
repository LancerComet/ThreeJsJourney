import * as THREE from 'three'
import { BufferGeometry, Material } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideMesh } from '../providers/mesh'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const Mesh = defineComponent({
  name: 'Mesh',

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

    scale: {
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

      updateVector3(props.position, mesh.position)
      updateVector3(props.rotation, mesh.rotation)
      updateVector3(props.scale, mesh.scale)
    }

    const revokeWatch = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      revokeWatch()
      mesh.clear()
      mesh.removeFromParent()
    })

    return () => (
      <div class='mesh' data-uuid={mesh.uuid}>{ slots.default?.() }</div>
    )
  }
})

export {
  Mesh
}
