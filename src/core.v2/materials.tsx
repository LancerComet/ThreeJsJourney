import * as THREE from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getSetMaterial } from './mesh'
import { getSetPointsMaterial } from './points'
import { isEqual } from './utils/equal'

const StandardMaterial = defineComponent({
  props: {
    params: Object as PropType<MeshStandardMaterialParameters>
  },

  setup (props) {
    let material: THREE.MeshStandardMaterial
    let updateTimer: NodeJS.Timeout
    const setMaterial = getSetMaterial()

    const createMaterial = () => {
      clearTimeout(updateTimer)
      updateTimer = setTimeout(() => {
        dispose()
        material = new THREE.MeshStandardMaterial(props.params)
        setMaterial(material)
      }, 1)
    }

    const dispose = () => {
      material?.dispose()
    }

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    const revoke = watch(props, (newValue, oldValue) => {
      const isPropChanged = !isEqual(newValue, oldValue)
      if (isPropChanged) {
        createMaterial()
      }
    }, {
      deep: true,
      immediate: true
    })

    return () => (
      <div class='standard-material' data-uuid={material?.uuid} />
    )
  }
})

const BasicMaterial = defineComponent({
  props: {
    params: Object as PropType<MeshBasicMaterialParameters>
  },

  setup (props) {
    let material: THREE.MeshBasicMaterial
    let updateTimer: NodeJS.Timeout
    const setMaterial = getSetMaterial()

    const createMaterial = () => {
      clearTimeout(updateTimer)
      setTimeout(() => {
        dispose()
        material = new THREE.MeshBasicMaterial(props.params)
        setMaterial(material)
      }, 1)
    }

    const dispose = () => {
      material?.dispose()
    }

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    const revoke = watch(props, (newValue, oldValue) => {
      const isPropChanged = !isEqual(newValue, oldValue)
      if (isPropChanged) {
        createMaterial()
      }
    }, {
      deep: true,
      immediate: true
    })

    return () => (
      <div class='basic-material' data-uuid={material?.uuid} />
    )
  }
})

const PointsMaterial = defineComponent({
  props: {
    params: Object as PropType<THREE.PointsMaterialParameters>
  },

  setup (props) {
    let material: THREE.PointsMaterial
    const setMaterial = getSetPointsMaterial()

    const createMaterial = () => {
      dispose()
      material = new THREE.PointsMaterial(props.params)
      setMaterial(material)
    }

    const dispose = () => {
      material?.dispose()
    }

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    const revoke = watch(props, createMaterial, {
      deep: true,
      immediate: true
    })

    return () => (
      <div class='points-material' data-uuid={material?.uuid} />
    )
  }
})
export {
  StandardMaterial,
  BasicMaterial,
  PointsMaterial
}
