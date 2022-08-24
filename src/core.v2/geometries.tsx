import * as THREE from 'three'
import { TextGeometry as THREETextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import {
  ComponentPublicInstance, defineComponent, onBeforeUnmount,
  PropType, watch, watchEffect
} from 'vue'
import { injectGetMesh } from './mesh'
import { injectGetPoints } from './points'

const PlaneGeometry = defineComponent({
  props: {
    width: Number as PropType<number>,
    height: Number as PropType<number>,
    widthSegment: Number as PropType<number>,
    heightSegment: Number as PropType<number>,
    translate: {
      type: Object as PropType<{ x: number, y: number, z: number }>
    }
  },

  setup (props) {
    let geometry: THREE.PlaneGeometry
    const getMesh = injectGetMesh()

    const createGeometry = () => {
      geometry = new THREE.PlaneGeometry(
        props.width,
        props.height,
        props.widthSegment,
        props.heightSegment
      )

      if (props.translate) {
        geometry.translate(
          props.translate.x,
          props.translate.y,
          props.translate.z
        )
      }

      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = geometry
      }
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watchEffect(() => {
      dispose()
      createGeometry()
    })

    onBeforeUnmount(() => {
      revoke()
      dispose()
    })

    return () => (
      <div class='plane-geometry' />
    )
  }
})

const BoxGeometry = defineComponent({
  props: {
    width: {
      type: Number as PropType<number>,
      default: 1
    },
    height: {
      type: Number as PropType<number>,
      default: 1
    },
    depth: {
      type: Number as PropType<number>,
      default: 1
    }
  },

  setup (props) {
    let geometry: THREE.BoxGeometry
    const getMesh = injectGetMesh()

    const createGeometry = () => {
      geometry = new THREE.BoxGeometry(
        props.width,
        props.height,
        props.depth
      )

      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = geometry
      }
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watchEffect(() => {
      dispose()
      createGeometry()
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='box-geometry' />
    )
  }
})

const SphereGeometry = defineComponent({
  props: {
    radius: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.SphereGeometry
    const getMesh = injectGetMesh()

    const createGeometry = () => {
      geometry = new THREE.SphereGeometry(props.radius)
      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = geometry
      }
    }

    const dispose = () => {
      geometry?.dispose()
    }

    const revoke = watchEffect(() => {
      dispose()
      createGeometry()
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='sphere-geometry' />
    )
  }
})

type GeometryAttrs = Record<THREE.BuiltinShaderAttributeName | string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute>

const BufferGeometry = defineComponent({
  setup (_, { expose }) {
    const geometry = new THREE.BufferGeometry()

    const getPoints = injectGetPoints()
    const getMesh = injectGetMesh()

    const points = getPoints()
    if (points) {
      points.geometry = geometry
    } else {
      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = geometry
      }
    }

    const getGeometry = (): THREE.BufferGeometry => {
      return geometry
    }

    const getAttributes = (): GeometryAttrs => {
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
      <div class='box-geometry' />
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
      type: Object as PropType<Font>,
      required: true
    },
    height: {
      type: Number as PropType<number>,
      required: true
    },
    size: {
      type: Number as PropType<number>,
      required: true
    }
  },
  setup (props) {
    let textGeometry: THREETextGeometry
    const getMesh = injectGetMesh()

    const createTextGeometry = () => {
      const font = props.font
      if (!font) {
        return
      }
      textGeometry = new THREETextGeometry(props.text, {
        font,
        height: props.height,
        size: props.size
      })

      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = textGeometry
      }
    }

    const dispose = () => {
      textGeometry?.dispose()
    }

    const revoke = watchEffect(() => {
      dispose()
      createTextGeometry()
    })

    onBeforeUnmount(() => {
      dispose()
      revoke()
    })

    return () => (
      <div class='text-geometry' />
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
