import * as THREE from 'three'
import { TextGeometry as THREETextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'

import { provideGeometry } from '../providers/geometry'
import { injectMesh } from '../providers/mesh'

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
    const mesh = injectMesh()

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

  setup (props) {
    let geometry: THREE.BoxGeometry
    const mesh = injectMesh()

    const createGeometry = () => {
      geometry = new THREE.BoxGeometry(
        props.width,
        props.height,
        props.depth,
        props.widthSegments,
        props.heightSegments,
        props.depthSegments
      )

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
    radius: Number as PropType<number>,
    widthSegment: Number as PropType<number>,
    heightSegment: Number as PropType<number>
  },

  setup (props) {
    let geometry: THREE.SphereGeometry | undefined
    const mesh = injectMesh()

    const createGeometry = () => {
      dispose()
      geometry = new THREE.SphereGeometry(props.radius, props.widthSegment, props.heightSegment)
      if (mesh) {
        mesh.geometry = geometry
      }
    }

    const dispose = () => {
      geometry?.dispose()
      geometry = undefined
    }

    const revoke = watchEffect(() => {
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

const BufferGeometry = defineComponent({
  setup (_, { slots }) {
    const geometry = new THREE.BufferGeometry()
    provideGeometry(geometry)

    const mesh = injectMesh()
    if (mesh) {
      mesh.geometry = geometry
    }

    onBeforeUnmount(() => {
      geometry?.dispose()
    })

    return () => (
      <div class='buffer-geometry' data-uuid={geometry.uuid}>
        { slots.default?.() }
      </div>
    )
  }
})

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
    const mesh = injectMesh()

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
    const mesh = injectMesh()

    const createTorus = () => {
      torus = new THREE.TorusGeometry(
        props.radius, props.tube, props.radialSegment, props.tubularSegments
      )
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
  SphereGeometry,
  BufferGeometry,
  TextGeometry,
  TorusGeometry
}
