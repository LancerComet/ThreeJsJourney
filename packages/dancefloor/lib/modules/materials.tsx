import * as THREE from 'three'
import { PointsMaterialParameters } from 'three'
import type { MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial'
import type { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial'
import { defineComponent, onBeforeUnmount, PropType, toRefs, watchEffect } from 'vue'
import { injectMesh } from '../providers/mesh'

const StandardMaterial = defineComponent({
  props: {
    params: {
      type: Object as PropType<MeshStandardMaterialParameters>,
      default: () => ({})
    }
  },

  setup (props) {
    const { params } = toRefs(props)
    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial(
      params.value
    )

    const mesh = injectMesh()
    if (mesh) {
      mesh.material = material
    }

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
      <div class='standard-material' />
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
    const material = new THREE.MeshBasicMaterial(params.value)

    const mesh = injectMesh()
    if (mesh) {
      mesh.material = material
    }

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
      <div class='basic-material' />
    )
  }
})

const PointsMaterial = defineComponent({
  props: {
    params: {
      type: Object as PropType<PointsMaterialParameters>,
      default: () => ({})
    }
  },

  setup (props) {
    const material = new THREE.PointsMaterial(props.params)

    const mesh = injectMesh()
    if (mesh?.type === 'Points') {
      mesh.material = material
    }

    const setProps = () => {
      material.setValues(props.params)
      material.needsUpdate = true
    }

    const removeSetProps = watchEffect(setProps)

    const dispose = () => {
      material?.dispose()
    }

    onBeforeUnmount(() => {
      dispose()
      removeSetProps()
    })

    return () => (
      <div class='points-material' data-uuid={material.uuid} />
    )
  }
})

const ShaderMaterial = defineComponent({
  name: 'ShaderMaterial',
  props: {
    params: {
      type: Object as PropType<THREE.ShaderMaterialParameters>,
      default: () => ({})
    }
  },
  setup (props) {
    const { params } = toRefs(props)
    const shaderMaterial = new THREE.ShaderMaterial(params.value)

    const mesh = injectMesh()
    if (mesh) {
      mesh.material = shaderMaterial
    }

    const dispose = () => {
      shaderMaterial?.dispose()
    }

    const revoke = watchEffect(() => {
      shaderMaterial.setValues(params.value)
      shaderMaterial.needsUpdate = true
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='shader-material' />
    )
  }
})

const MatcapMaterial = defineComponent({
  name: 'MatcapMaterial',

  props: {
    params: {
      type: Object as PropType<THREE.MeshMatcapMaterialParameters>,
      default: () => ({})
    }
  },

  setup (props) {
    const { params } = toRefs(props)
    const material = new THREE.MeshMatcapMaterial(params.value)

    const mesh = injectMesh()
    if (mesh) {
      mesh.material = material
    }

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
      <div class='matcap-material' />
    )
  }
})

export {
  StandardMaterial,
  BasicMaterial,
  PointsMaterial,
  ShaderMaterial,
  MatcapMaterial
}
