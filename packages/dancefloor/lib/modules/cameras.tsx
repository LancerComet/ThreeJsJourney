import * as THREE from 'three'
import { Scene, Vector3 } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { provideCamera } from '../providers/cameras'
import { injectContainer } from '../providers/container'
import { injectOnTick } from '../providers/ontick'
import { injectRenderer } from '../providers/renderer'
import { injectOnResize } from '../providers/resize'

const PerspectiveCamera = defineComponent({
  name: 'PerspectiveCamera',

  props: {
    position: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({})
    },
    quaternion: {
      type: Object as PropType<{ x: number, y: number, z: number, w: number }>,
      default: () => ({})
    },
    fov: {
      type: Number as PropType<number>,
      default: 75
    },
    aspect: {
      type: Number as PropType<number>,
      default: window.innerWidth / window.innerHeight
    },
    near: {
      type: Number as PropType<number>,
      default: 0.1
    },
    far: {
      type: Number as PropType<number>,
      default: 1000
    },
    lookAt: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const camera = new THREE.PerspectiveCamera(
      props.fov, props.aspect, props.near, props.far
    )
    provideCamera(camera)

    const scene = injectContainer() as Scene | undefined
    scene?.add(camera)

    const renderer = injectRenderer()

    const onTick = injectOnTick()
    const disposeOnTick = onTick?.(() => {
      scene && renderer?.render(scene, camera)
    })

    const onResize = injectOnResize()
    const removeOnResize = onResize?.((width, height) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    })

    const setPosition = () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const newVal = props.position?.[key] ?? 0
        const oldVal = camera.position[key]
        if (newVal !== oldVal) {
          camera.position[key] = newVal
        }
      })
    }

    const setQuaternion = () => {
      ['x', 'y', 'z', 'w'].forEach(item => {
        const key = item as 'x' | 'y' | 'z' | 'w'
        const newVal = props.quaternion?.[key] ?? 0
        const oldVal = camera.quaternion[key]
        if (newVal !== oldVal) {
          camera.quaternion[key] = newVal
        }
      })
    }

    const setLookAt = () => {
      camera.lookAt(new Vector3(props.lookAt.x, props.lookAt.y, props.lookAt.z))
    }

    const setProps = () => {
      setPosition()
      setQuaternion()
      setLookAt()
      camera.fov = props.fov
      camera.aspect = props.aspect
      camera.near = props.near
      camera.far = props.far
      camera.updateProjectionMatrix()
    }

    const removeWatch = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      removeWatch()
      removeOnResize?.()
      disposeOnTick?.()
      scene?.remove(camera)
    })

    return () => (
      <div class='perspective-camera'>
        { slots.default?.() }
      </div>
    )
  }
})

const OrthographicCamera = defineComponent({
  name: 'OrthographicCamera',

  props: {
    left: {
      type: Number as PropType<number>,
      default: -1
    },
    right: {
      type: Number as PropType<number>,
      default: 1
    },
    top: {
      type: Number as PropType<number>,
      default: 1
    },
    bottom: {
      type: Number as PropType<number>,
      default: -1
    },
    near: {
      type: Number as PropType<number>,
      default: 0.1
    },
    far: {
      type: Number as PropType<number>,
      default: 2000
    },
    lookAt: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({})
    },
    position: {
      type: Object as PropType<{ x: number, y: number, z: number }>,
      default: () => ({})
    },
    quaternion: {
      type: Object as PropType<{ x: number, y: number, z: number, w: number }>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const camera = new THREE.OrthographicCamera(
      props.left, props.right, props.top, props.bottom,
      props.near, props.far
    )
    provideCamera(camera)

    const scene = injectContainer() as Scene | undefined
    scene?.add(camera)

    const renderer = injectRenderer()

    const onTick = injectOnTick()
    const disposeOnTick = onTick?.(() => {
      scene && renderer?.render(scene, camera)
    })

    const onResize = injectOnResize()
    const removeOnResize = onResize?.(() => {
      camera.updateProjectionMatrix()
    })

    const setSize = () => {
      camera.top = props.top
      camera.bottom = props.bottom
      camera.left = props.left
      camera.right = props.right
    }

    const setPosition = () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const newVal = props.position?.[key] ?? 0
        const oldVal = camera.position[key]
        if (newVal !== oldVal) {
          camera.position[key] = newVal
        }
      })
    }

    const setQuaternion = () => {
      ['x', 'y', 'z', 'w'].forEach(item => {
        const key = item as 'x' | 'y' | 'z' | 'w'
        const newVal = props.quaternion?.[key] ?? 0
        const oldVal = camera.quaternion[key]
        if (newVal !== oldVal) {
          camera.quaternion[key] = newVal
        }
      })
    }

    const setLookAt = () => {
      camera.lookAt(new Vector3(props.lookAt.x, props.lookAt.y, props.lookAt.z))
    }

    const setProps = () => {
      setSize()
      setPosition()
      setQuaternion()
      setLookAt()
      camera.near = props.near
      camera.far = props.far
      camera.updateProjectionMatrix()
    }

    const removeWatch = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      removeWatch()
      removeOnResize?.()
      disposeOnTick?.()
      scene?.remove(camera)
    })

    return () => (
      <div class='orthographic-camera'>
        {slots.default?.()}
      </div>
    )
  }
})

export {
  PerspectiveCamera,
  OrthographicCamera
}
