import * as THREE from 'three'
import { computed, defineComponent, inject, PropType, provide, ref, watch } from 'vue'
import { getScene } from './scene'
import { isNumber } from './utils'

const injectKeySetMaterial = 'setMaterial'
const injectKeySetGeometry = 'setGeometry'

const useMesh = () => {
  const Mesh = defineComponent({
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

      const setProps = () => {
        if (!mesh) {
          return
        }

        mesh.castShadow = props.castShadow === true
        mesh.receiveShadow = props.receiveShadow === true

        if (isNumber(props.position.x)) { mesh.position.x = props.position.x }
        if (isNumber(props.position.y)) { mesh.position.y = props.position.y }
        if (isNumber(props.position.z)) { mesh.position.z = props.position.z }

        if (isNumber(props.rotation.x)) { mesh.rotation.x = props.rotation.x }
        if (isNumber(props.rotation.y)) { mesh.rotation.y = props.rotation.y }
        if (isNumber(props.rotation.z)) { mesh.rotation.z = props.rotation.z }
      }

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
