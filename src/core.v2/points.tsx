import * as THREE from 'three'
import { defineComponent, inject, onBeforeUnmount, PropType, provide, ref, watch } from 'vue'
import { injectContainer } from './providers/container'

const injectKeySetMaterial = 'three:point:setMaterial'
const injectKeySetGeometry = 'three:point:setGeometry'

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
    }
  },

  setup (props, { slots }) {
    let points: THREE.Points
    let _material: THREE.PointsMaterial
    let _geometry: THREE.BufferGeometry
    const container = injectContainer()

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
      }
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      revoke()
    })

    return () => (
      <div class='points'>{ slots.default?.() }</div>
    )
  }
})

const getSetPointsMaterial = () => {
  return inject<(Points: THREE.PointsMaterial) => void>(injectKeySetMaterial, () => {
    console.warn('You should use this component under <points/>.')
  })
}

const getSetPointsGeometry = () => {
  return inject<(Points: THREE.BufferGeometry) => void>(injectKeySetGeometry)
}

export {
  Points,
  getSetPointsMaterial,
  getSetPointsGeometry
}
