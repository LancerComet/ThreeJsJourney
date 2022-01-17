import * as THREE from 'three'
import { defineComponent, inject, PropType, provide, ref, watch } from 'vue'
import { getScene } from './scene'
import { isNumber } from './utils'

const injectKeySetMaterial = 'setMaterial'
const injectKeySetGeometry = 'setGeometry'

const usePoints = () => {
  return {
    Points: defineComponent({
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

      setup (props, { slots }) {
        let points: THREE.Points
        let _material: THREE.PointsMaterial
        let _geometry: THREE.BufferGeometry
        const scene = getScene()
        const uuid = ref('')

        const setMaterial = (Points: THREE.PointsMaterial) => {
          _material = Points
          updateMesh()
        }
        provide(injectKeySetMaterial, setMaterial)

        const setGeometry = (geometry: THREE.BufferGeometry) => {
          _geometry = geometry
          updateMesh()
        }
        provide(injectKeySetGeometry, setGeometry)

        const setProps = () => {
          if (!points) {
            return
          }

          points.castShadow = props.castShadow === true
          points.receiveShadow = props.receiveShadow === true

          if (isNumber(props.position.x)) { points.position.x = props.position.x }
          if (isNumber(props.position.y)) { points.position.y = props.position.y }
          if (isNumber(props.position.z)) { points.position.z = props.position.z }

          if (isNumber(props.rotation.x)) { points.rotation.x = props.rotation.x }
          if (isNumber(props.rotation.y)) { points.rotation.y = props.rotation.y }
          if (isNumber(props.rotation.z)) { points.rotation.z = props.rotation.z }
        }

        const updateMesh = () => {
          if (!scene) {
            return
          }
          if (points) {
            scene.remove(points)
          }
          if (_geometry && _material) {
            points = new THREE.Points(_geometry, _material)
            setProps()
            scene.add(points)
            uuid.value = points.uuid
          }
        }

        watch(props, setProps, {
          deep: true,
          immediate: true
        })

        return () => (
          <div class='points' data-uuid={uuid.value}>{ slots.default?.() }</div>
        )
      }
    })
  }
}

const getSetPointsMaterial = () => {
  return inject<(Points: THREE.PointsMaterial) => void>(injectKeySetMaterial, () => {
    console.warn('You should use this component under <points/>.')
  })
}

const getSetPointsGeometry = () => {
  return inject<(Points: THREE.BufferGeometry) => void>(injectKeySetGeometry, () => {
    console.warn('You should use this component under <points/>.')
  })
}

export {
  usePoints,
  getSetPointsMaterial,
  getSetPointsGeometry
}
