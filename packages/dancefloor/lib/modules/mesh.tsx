import * as THREE from 'three'
import { BufferGeometry, Material } from 'three'
import {
  ComponentPublicInstance,
  defineComponent,
  inject,
  onBeforeUnmount,
  PropType,
  provide,
  watchEffect
} from 'vue'
import { injectContainer } from '../providers/container'

const injectKeyGetMesh = 'three:mesh:getMesh'

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

  setup (props, { slots, expose }) {
    const mesh = new THREE.Mesh()
    const container = injectContainer()
    container?.add(mesh)

    const getMesh = (): THREE.Mesh => {
      return mesh
    }
    provide(injectKeyGetMesh, getMesh)

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

    expose({
      getMesh
    })

    onBeforeUnmount(() => {
      revoke()
      mesh.clear()
      mesh.removeFromParent()
      container?.remove(mesh)
    })

    return () => (
      <div class='mesh'>{ slots.default?.() }</div>
    )
  }
})

const injectGetMesh = () => {
  return inject<() => THREE.Mesh | undefined>(injectKeyGetMesh, () => {
    console.warn('You should use this component under <Mesh/>.')
    return undefined
  })
}

type MeshVM = ComponentPublicInstance<{
  receiveShadow: boolean
  castShadow: boolean
  position: Partial<{ x: number, y: number, z: number }>
  rotation: Partial<{ x: number, y: number, z: number }>
}, {
  getMesh: () => THREE.Mesh
}>

export {
  Mesh,
  MeshVM,
  injectGetMesh
}
