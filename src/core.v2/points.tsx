import * as THREE from 'three'
import { defineComponent, inject, PropType, provide, ref, watch } from 'vue'
import { injectContainer } from './providers/container'

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
        const container = injectContainer()
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
          if (!points) {
            return
          }
          points.castShadow = props.castShadow === true
          points.receiveShadow = props.receiveShadow === true
          setPositionRotation()
        }

        const updateMesh = () => {
          if (!container) {
            return
          }
          if (points) {
            container.remove(points)
          }
          if (_geometry && _material) {
            points = new THREE.Points(_geometry, _material)
            setProps()
            container.add(points)
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
