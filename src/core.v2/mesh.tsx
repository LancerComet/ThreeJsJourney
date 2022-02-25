import * as THREE from 'three'
import { computed, defineComponent, inject, PropType, provide, ref, watch } from 'vue'
import { getScene } from './scene'

const injectKeySetMaterial = 'setMaterial'
const injectKeySetGeometry = 'setGeometry'

const useMesh = () => {
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

    setup (props, { slots, expose }) {
      let mesh: THREE.Mesh
      let _material: THREE.Material
      let _geometry: THREE.BufferGeometry
      const scene = getScene()
      const uuid = ref('')

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
        if (!scene) {
          return
        }
        if (mesh) {
          scene.remove(mesh)
        }
        if (_geometry && _material) {
          mesh = new THREE.Mesh(_geometry, _material)
          setProps()
          scene.add(mesh)
          uuid.value = mesh.uuid
        }
      }

      const setProps = () => {
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

      watch(props, setProps, {
        deep: true,
        immediate: true
      })

      expose({
        meshRef: computed(() => mesh)
      })

      return () => (
        <div class='mesh' data-uuid={uuid.value}>{ slots.default?.() }</div>
      )
    }
  })

  return {
    Mesh
  }
}

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

export {
  useMesh,
  getSetMaterial,
  getSetGeometry
}
