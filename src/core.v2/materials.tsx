import * as THREE from 'three'
import { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial'
import { defineComponent, onBeforeUnmount, PropType, toRefs, watch, watchEffect } from 'vue'
import { getSetMaterial } from './mesh'
import { getSetPointsMaterial } from './points'

const StandardMaterial = defineComponent({
  props: {
    params: {
      type: Object as PropType<MeshStandardMaterialParameters>,
      default: () => ({})
    }
  },

  setup (props) {
    const { params } = toRefs(props)
    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial()
    const setMaterial = getSetMaterial()

    const dispose = () => {
      material?.dispose()
    }

    const revoke = watchEffect(() => {
      material.setValues(params.value)
      material.needsUpdate = true
      setMaterial(material)
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='standard-material' data-uuid={material.uuid} />
    )
  }
})

const BasicMaterial = defineComponent({
  props: {
    params: {
      type: Object as PropType<MeshBasicMaterialParameters>,
      default: () => ({})
    }
  },

  setup (props) {
    const { params } = toRefs(props)
    const material = new THREE.MeshBasicMaterial()

    const setMaterial = getSetMaterial()
    setMaterial(material)

    const dispose = () => {
      material?.dispose()
    }

    const revoke = watchEffect(() => {
      material.setValues(params.value)
      material.needsUpdate = true
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
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
