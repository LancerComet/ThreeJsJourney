import { BoxGeometry, BufferAttribute, BufferGeometry, PlaneGeometry, SphereGeometry } from 'three'
import { defineComponent, onBeforeUnmount, popScopeId, PropType, watch } from 'vue'
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
        const setGeometry = getSetGeometry()

        const createGeometry = () => {
          dispose()
          geometry = new PlaneGeometry(
            props.width,
            props.height
          )
          setGeometry(geometry)
        }

        const dispose = () => {
          geometry?.dispose()
        }

        watch(props, createGeometry, {
          deep: true,
          immediate: true
        })

        onBeforeUnmount(dispose)

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
        const setGeometry = getSetGeometry()

        const createGeometry = () => {
          dispose()
          geometry = new BoxGeometry(
            props.width,
            props.height,
            props.depth
          )
          setGeometry(geometry)
        }

        const dispose = () => {
          geometry?.dispose()
        }

        watch(props, createGeometry, {
          deep: true,
          immediate: true
        })

        onBeforeUnmount(dispose)

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

        watch(props, createGeometry, {
          deep: true,
          immediate: true
        })

        onBeforeUnmount(dispose)

        return () => (
          <div class='sphere-geometry' data-uuid={geometry?.uuid} />
        )
      }
    })
  }
}

const useBufferGeometry = () => {
  const geometry = new BufferGeometry()

  return {
    geometry,
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

export {
  usePlaneGeometry,
  useBoxGeometry,
  useSphereGeometry,
  useBufferGeometry
}
