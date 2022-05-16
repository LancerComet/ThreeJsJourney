import * as THREE from 'three'
import { TextGeometry as THREETextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { ComponentPublicInstance, defineComponent, onBeforeUnmount, PropType, ref, watch, watchEffect } from 'vue'
import { getSetGeometry } from './mesh'
import { getSetPointsGeometry } from './points'

const PlaneGeometry = defineComponent({
  props: {
    width: Number as PropType<number>,
    height: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.PlaneGeometry
    let createTimer: NodeJS.Timeout
    const setGeometry = getSetGeometry()

    const createGeometry = () => {
      clearTimeout(createTimer)
      createTimer = setTimeout(() => {
        geometry = new THREE.PlaneGeometry(
          props.width,
          props.height
        )
        setGeometry(geometry)
      }, 1)
      dispose()
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watch(props, (newValue, oldValue) => {
      const isSizeChanged = newValue.width !== oldValue?.width ||
        newValue.height !== oldValue?.height
      if (isSizeChanged) {
        createGeometry()
      }
    }, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      revoke()
      dispose()
    })

    return () => (
      <div class='plane-geometry' data-uuid={geometry?.uuid} />
    )
  }
})

const BoxGeometry = defineComponent({
  props: {
    width: Number as PropType<number>,
    height: Number as PropType<number>,
    depth: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.BoxGeometry
    let updateTimer: NodeJS.Timeout
    const setGeometry = getSetGeometry()

    const createGeometry = () => {
      clearTimeout(updateTimer)
      updateTimer = setTimeout(() => {
        dispose()
        geometry = new THREE.BoxGeometry(
          props.width,
          props.height,
          props.depth
        )
        setGeometry(geometry)
      }, 1)
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watch(props, (newValue, oldValue) => {
      const isSizeChanged = newValue.width !== oldValue?.width ||
        newValue.height !== oldValue?.height ||
        newValue.depth !== oldValue?.depth

      if (isSizeChanged) {
        createGeometry()
      }
    }, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='box-geometry' data-uuid={geometry?.uuid} />
    )
  }
})

const SphereGeometry = defineComponent({
  props: {
    radius: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.SphereGeometry
    const setGeometry = getSetGeometry()

    const createGeometry = () => {
      dispose()
      geometry = new THREE.SphereGeometry(props.radius)
      setGeometry(geometry)
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watch(props, createGeometry, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='sphere-geometry' data-uuid={geometry?.uuid} />
    )
  }
})

type GeometryAttrs = Record<THREE.BuiltinShaderAttributeName | string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute>

const BufferGeometry = defineComponent({
  setup (_, { expose }) {
    const geometry = new THREE.BufferGeometry()

    const setPointGeometry = getSetPointsGeometry()
    if (setPointGeometry) {
      setPointGeometry(geometry)
    } else {
      const setGeometry = getSetGeometry()
      setGeometry(geometry)
    }

    const getGeometry = (): GeometryAttrs => {
      return geometry.attributes
    }

    const getAttributes = () => {
      return geometry.attributes
    }

    const setAttributes = (attrs: Partial<GeometryAttrs>) => {
      Object.keys(attrs).forEach(name => {
        const value = attrs[name]
        value && geometry.setAttribute(name, value)
      })
    }

    onBeforeUnmount(() => {
      geometry?.dispose()
    })

    expose({
      getAttributes,
      getGeometry,
      setAttributes
    })

    return () => (
      <div class='box-geometry' data-uuid={geometry?.uuid} />
    )
  }
})

type BufferGeometryComponent = ComponentPublicInstance<{
  attributes: Partial<GeometryAttrs>
}, {
  getGeometry: () => THREE.BufferGeometry,
  getAttributes: () => GeometryAttrs
  setAttributes: (attrs: Partial<GeometryAttrs>) => void
}>

const TextGeometry = defineComponent({
  name: 'TextGeometry',
  props: {
    text: {
      type: String as PropType<string>,
      default: ''
    },
    font: {
      type: Object as PropType<Font>
    },
    height: {
      type: Number as PropType<number>
    },
    size: {
      type: Number as PropType<number>
    }
  },
  setup (props) {
    let textGeometry: THREETextGeometry
    const setGeometry = getSetGeometry()
    const uuidRef = ref('')

    const createTextGeometry = () => {
      const font = props.font
      if (!font) {
        return
      }
      dispose()
      textGeometry = new THREETextGeometry(props.text, {
        font,
        height: props.height,
        size: props.size
      })
      uuidRef.value = textGeometry.uuid
      setGeometry(textGeometry)
    }

    const dispose = () => {
      textGeometry?.dispose()
    }

    const revoke = watch(props, createTextGeometry, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='text-geometry' data-uid={uuidRef.value} />
    )
  }
})

export {
  PlaneGeometry,
  BoxGeometry,
  BufferGeometryComponent,
  SphereGeometry,
  BufferGeometry,
  TextGeometry
}
