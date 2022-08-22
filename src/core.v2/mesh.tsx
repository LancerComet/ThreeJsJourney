import * as THREE from 'three'
import {
  ComponentPublicInstance,
  defineComponent,
  inject,
  onBeforeUnmount,
  PropType,
  provide,
  ref,
  watch
} from 'vue'
import { injectContainer } from './providers/container'

const injectKeySetMaterial = 'three:mesh:setMaterial'
const injectKeySetGeometry = 'three:mesh:setGeometry'

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
    }
  },

  emits: ['update'],

  setup (props, { slots, expose, emit }) {
    let _material: THREE.Material
    let _geometry: THREE.BufferGeometry
    const container = injectContainer()
    const meshRef = ref<THREE.Mesh>()

    const setMaterial = (material: THREE.Material) => {
      _material = material
      updateMesh()
    }
    provide(injectKeySetMaterial, setMaterial)

    const setGeometry = (geometry: THREE.BufferGeometry) => {
      _geometry = geometry
      updateMesh()
    }
    provide(injectKeySetGeometry, setGeometry)

    const updateMesh = () => {
      if (!container || !_geometry || !_material) {
        return
      }
      if (meshRef.value) {
        container.remove(meshRef.value)
      }

      const mesh = new THREE.Mesh(_geometry, _material)
      meshRef.value = mesh
      setProps()
      container.add(mesh)

      emit('update', mesh)
    }

    const setProps = () => {
      const mesh = meshRef.value
      if (!mesh) {
        return
      }

      if (mesh.castShadow !== props.castShadow) {
        mesh.castShadow = props.castShadow === true
      }

      if (mesh.receiveShadow !== props.receiveShadow) {
        mesh.receiveShadow = props.receiveShadow === true
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
      })
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    expose({
      getMesh: () => meshRef.value
    })

    onBeforeUnmount(() => {
      revoke()
      meshRef.value?.clear()
      meshRef.value?.removeFromParent()
      meshRef.value = undefined
    })

    return () => (
      <div class='mesh'>{ slots.default?.() }</div>
    )
  }
})

const getSetMaterial = () => {
  return inject<(material: THREE.Material) => void>(injectKeySetMaterial, () => {
    console.warn('You should use this component under <Mesh/>.')
  })
}

const getSetGeometry = () => {
  return inject<(material: THREE.BufferGeometry) => void>(injectKeySetGeometry, () => {
    console.warn('You should use this component under <Mesh/>.')
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
  getSetMaterial,
  getSetGeometry
}
