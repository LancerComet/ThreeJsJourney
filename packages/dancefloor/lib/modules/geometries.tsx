import * as THREE from 'three'
import { TextGeometry as THREETextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import {
  ComponentPublicInstance, defineComponent, onBeforeUnmount,
  PropType, watchEffect
} from 'vue'
import { injectGetMesh } from './mesh'
import { injectGetPoints } from './points'

const PlaneGeometry = defineComponent({
  props: {
    width: Number as PropType<number>,
    height: Number as PropType<number>,
    widthSegment: Number as PropType<number>,
    heightSegment: Number as PropType<number>,
    translate: Object as PropType<{ x: number, y: number, z: number }>,
    onCreated: Function as PropType<(geometry: THREE.PlaneGeometry) => void>
  },

  emits: ['created'],

  setup (props, { emit }) {
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

      emit('created', geometry)
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
    },
    widthSegments: {
      type: Number as PropType<number>,
      default: 1
    },
    heightSegments: {
      type: Number as PropType<number>,
      default: 1
    },
    depthSegments: {
      type: Number as PropType<number>,
      default: 1
    }
  },

  setup (props, { expose }) {
    let geometry: THREE.BoxGeometry
    const getMesh = injectGetMesh()

    const createGeometry = () => {
      geometry = new THREE.BoxGeometry(
        props.width,
        props.height,
        props.depth,
        props.widthSegments,
        props.heightSegments,
        props.depthSegments
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

    const getGeometry = () => {
      return geometry
    }

    expose({
      getGeometry
    })

    return () => (
      <div class='box-geometry' />
    )
  }
})

type BoxGeometryComponent = ComponentPublicInstance<{
  width?: number
  height?: number
  depth?: number
}, {
  getGeometry: () => THREE.BoxGeometry,
}>

const SphereGeometry = defineComponent({
  props: {
    radius: Number as PropType<number>,
    widthSegment: Number as PropType<number>,
    heightSegment: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.SphereGeometry
    const getMesh = injectGetMesh()

    const createGeometry = () => {
      geometry = new THREE.SphereGeometry(props.radius, props.widthSegment, props.heightSegment)
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

type GeometryAttrs = Record<string, THREE.BufferAttribute | THREE.InterleavedBufferAttribute>

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
      type: Object as PropType<Font>
    },
    height: {
      type: Number as PropType<number>,
      required: true
    },
    size: {
      type: Number as PropType<number>,
      required: true
    },
    curveSegments: {
      type: Number as PropType<number>
    },
    computeBoundingBox: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    centered: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    onCreated: {
      type: Function as PropType<(textGeometry: THREETextGeometry) => void>
    }
  },

  emits: ['created'],

  setup (props, { emit }) {
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
        size: props.size,
        curveSegments: props.curveSegments
      })

      if (props.computeBoundingBox) {
        textGeometry.computeBoundingBox()
      }

      if (props.centered) {
        textGeometry.center()
      }

      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = textGeometry
      }

      emit('created', textGeometry)
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

const TorusGeometry = defineComponent({
  name: 'TorusGeometry',

  props: {
    radius: Number as PropType<number>,
    tube: Number as PropType<number>,
    radialSegment: Number as PropType<number>,
    tubularSegments: Number as PropType<number>
  },

  setup (props) {
    let torus: THREE.TorusGeometry
    const getMesh = injectGetMesh()

    const createTorus = () => {
      torus = new THREE.TorusGeometry(props.radius, props.tube, props.radialSegment, props.tubularSegments)
      const mesh = getMesh()
      if (mesh) {
        mesh.geometry = torus
      }
    }

    const revoke = watchEffect(() => {
      createTorus()
    })

    onBeforeUnmount(() => {
      revoke()
    })

    return () => (
      <div class='torus-geometry' />
    )
  }
})

export {
  PlaneGeometry,
  BoxGeometry,
  BoxGeometryComponent,
  SphereGeometry,
  BufferGeometry,
  BufferGeometryComponent,
  TextGeometry,
  TorusGeometry
}
