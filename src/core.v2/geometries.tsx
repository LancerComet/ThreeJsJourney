import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  BuiltinShaderAttributeName,
  PlaneGeometry,
  SphereGeometry
} from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { InterleavedBufferAttribute } from 'three/src/core/InterleavedBufferAttribute'
import { defineComponent, onBeforeUnmount, PropType, ref, watch } from 'vue'
import { getSetGeometry } from './mesh'

const usePlaneGeometry = () => {
  return {
    PlaneGeometry: defineComponent({
      props: {
        width: Number as PropType<number>,
        height: Number as PropType<number>
      },

      setup (props) {
        let geometry: PlaneGeometry
        let createTimer: NodeJS.Timeout
        const setGeometry = getSetGeometry()

        const createGeometry = () => {
          clearTimeout(createTimer)
          createTimer = setTimeout(() => {
            geometry = new PlaneGeometry(
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
  }
}

const useBoxGeometry = () => {
  return {
    BoxGeometry: defineComponent({
      props: {
        width: Number as PropType<number>,
        height: Number as PropType<number>,
        depth: Number as PropType<number>
      },

      setup (props) {
        let geometry: BoxGeometry
        let updateTimer: NodeJS.Timeout
        const setGeometry = getSetGeometry()

        const createGeometry = () => {
          clearTimeout(updateTimer)
          updateTimer = setTimeout(() => {
            dispose()
            geometry = new BoxGeometry(
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
  }
}

const useSphereGeometry = () => {
  return {
    SphereGeometry: defineComponent({
      props: {
        radius: Number as PropType<number>
      },

      setup (props) {
        let geometry: SphereGeometry
        const setGeometry = getSetGeometry()

        const createGeometry = () => {
          dispose()
          geometry = new SphereGeometry(props.radius)
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
  }
}

const useBufferGeometry = () => {
  const geometry = new BufferGeometry()

  const setAttribute = (name: BuiltinShaderAttributeName | string, attribute: BufferAttribute | InterleavedBufferAttribute) => {
    geometry.setAttribute(name, attribute)
  }

  return {
    geometry,
    setAttribute,
    BufferGeometry: defineComponent({
      setup () {
        const setGeometry = getSetGeometry()
        setGeometry(geometry)

        const dispose = () => {
          geometry?.dispose()
        }

        onBeforeUnmount(() => {
          dispose()
        })

        return () => (
          <div class='box-geometry' data-uuid={geometry?.uuid} />
        )
      }
    })
  }
}

const useTextGeometry = () => {
  return {
    TextGeometry: defineComponent({
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
        let textGeometry: TextGeometry
        const setGeometry = getSetGeometry()
        const uuidRef = ref('')

        const createTextGeometry = () => {
          const font = props.font
          if (!font) {
            return
          }
          dispose()
          textGeometry = new TextGeometry(props.text, {
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
  }
}

export {
  usePlaneGeometry,
  useBoxGeometry,
  useSphereGeometry,
  useBufferGeometry,
  useTextGeometry
}
