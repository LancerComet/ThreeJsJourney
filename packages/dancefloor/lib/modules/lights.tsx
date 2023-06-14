import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideLight } from '../providers/light'

const AmbientLight = defineComponent({
  props: {
    color: {
      type: Number as PropType<number>,
      default: 0xffffff
    },
    intensity: {
      type: Number as PropType<number>,
      default: 0.5
    }
  },

  setup (props) {
    const ambientLight = new THREE.AmbientLight()

    const setProps = () => {
      const newColor = new THREE.Color(props.color)
      if (!ambientLight.color.equals(newColor)) {
        ambientLight.color = newColor
      }

      if (ambientLight.intensity !== props.intensity) {
        ambientLight.intensity = props.intensity
      }
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      ambientLight.dispose()
      container?.remove(ambientLight)
      revoke()
    })

    const container = injectContainer()
    if (container) {
      container.add(ambientLight)
    }

    return () => (
      <div class='ambient-light' />
    )
  }
})

const PointLight = defineComponent({
  props: {
    castShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    shadowSize: {
      type: Number as PropType<number>,
      default: 512
    },
    color: {
      type: Number as PropType<number>,
      default: 0xffffff
    },
    intensity: {
      type: Number as PropType<number>,
      default: 0.5
    },
    distance: {
      type: Number as PropType<number>,
      default: 0
    },
    decay: {
      type: Number as PropType<number>,
      default: 1
    },
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    showHelper: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    hide: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  setup (props) {
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    const pointLightHelper = new THREE.PointLightHelper(pointLight)

    const setShadow = () => {
      pointLight.castShadow = props.castShadow === true
      pointLight.shadow.mapSize.width = props.shadowSize ?? 512
      pointLight.shadow.mapSize.height = props.shadowSize ?? 512
    }

    const revoke = watch(props, () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'

        const positionValue = props.position?.[key] ?? 0
        if (positionValue !== pointLight.position[key]) {
          pointLight.position[key] = positionValue
        }
      })

      const isShadowChanged = (pointLight.castShadow !== props.castShadow) ||
        (pointLight.shadow.mapSize.width !== props.shadowSize)
      if (isShadowChanged) {
        setShadow()
      }

      if (pointLight.intensity !== props.intensity) {
        pointLight.intensity = props.intensity
      }

      const newColor = new THREE.Color(props.color)
      if (!pointLight.color.equals(newColor)) {
        pointLight.color = newColor
      }

      if (pointLight.distance !== props.distance) {
        pointLight.distance = props.distance ?? 0
      }

      if (pointLight.decay !== props.decay) {
        pointLight.decay = props.decay ?? 1
      }

      pointLightHelper.visible = props.showHelper === true

      pointLight.visible = props.hide === false
    }, {
      deep: true,
      immediate: true
    })

    const container = injectContainer()
    if (container) {
      container.add(pointLight)
      container.add(pointLightHelper)
    }

    onBeforeUnmount(() => {
      pointLight.dispose()
      container?.remove(pointLight)
      revoke()
    })

    return () => (
      <div class='point-light' />
    )
  }
})

const DirectionalLight = defineComponent({
  name: 'DirectionalLight',

  props: {
    castShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    shadowSize: {
      type: Number as PropType<number>,
      default: 512
    },
    color: {
      type: Number as PropType<number>,
      default: 0xffffff
    },
    intensity: {
      type: Number as PropType<number>,
      default: 0.5
    },
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    },
    showHelper: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    shadowCamera: {
      type: Object as PropType<Partial<{
        near: number, far: number
        // top: number, left: number, right: number, bottom: number
      }>>
    }
  },

  setup (props) {
    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    const lightHelper = new THREE.DirectionalLightHelper(light)

    const revoke = watch(props, () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const newValue = props.position?.[key] ?? 0
        if (newValue !== light.position[key]) {
          light.position[key] = newValue
        }
      })

      if (light.castShadow !== props.castShadow) {
        light.castShadow = props.castShadow === true
      }

      if (light.shadow.mapSize.width !== props.shadowSize) {
        light.shadow.mapSize.width = props.shadowSize ?? 512
        light.shadow.mapSize.height = props.shadowSize ?? 512
      }

      const near = props.shadowCamera?.near ?? 0.1
      if (near !== light.shadow.camera.near) {
        light.shadow.camera.near = near
      }

      const far = props.shadowCamera?.far ?? 2000
      if (far !== light.shadow.camera.far) {
        light.shadow.camera.far = far
      }

      if (light.intensity !== props.intensity) {
        light.intensity = props.intensity
      }

      const newColor = new THREE.Color(props.color)
      if (!light.color.equals(newColor)) {
        light.color = newColor
      }

      lightHelper.visible = props.showHelper === true
    }, {
      deep: true,
      immediate: true
    })

    const container = injectContainer()
    if (container) {
      container.add(light)
      container.add(lightHelper)
    }

    onBeforeUnmount(() => {
      light.dispose()
      container?.remove(light)
      revoke()
    })

    return () => (
      <div class='directional-light' />
    )
  }
})

const HemisphereLight = defineComponent({
  name: 'HemisphereLight',

  props: {
    skyColor: Number as PropType<THREE.ColorRepresentation>,
    groundColor: Number as PropType<THREE.ColorRepresentation>,
    intensity: Number as PropType<number>,
    hide: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const light = new THREE.HemisphereLight(props.skyColor, props.groundColor, props.intensity)

    const container = injectContainer()
    container?.add(light)

    const revoke = watchEffect(() => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const newValue = props.position?.[key] ?? 0
        if (newValue !== light.position[key]) {
          light.position[key] = newValue
        }
      })

      const newGroundColor = new THREE.Color(props.groundColor)
      if (!light.groundColor.equals(newGroundColor)) {
        light.groundColor.set(newGroundColor)
      }

      const newSkyColor = new THREE.Color(props.skyColor)
      if (!light.color.equals(newSkyColor)) {
        light.color.set(newSkyColor)
      }

      light.visible = props.hide === false
    })

    onBeforeUnmount(() => {
      revoke()
    })

    return () => (
      <div class='hemisphere-light'>
        { slots.default?.() }
      </div>
    )
  }
})

const RectAreaLight = defineComponent({
  name: 'RectAreaLight',

  props: {
    intensity: Number as PropType<number>,
    width: Number as PropType<number>,
    height: Number as PropType<number>,
    color: {
      type: [Number, Object] as PropType<THREE.ColorRepresentation>,
      default: 0xffffff
    },
    position: {
      type: Object as PropType<Partial<{ x: number, y: number, z: number }>>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const light = new THREE.RectAreaLight(props.color, props.intensity, props.width, props.height)
    provideLight(light)

    const container = injectContainer()
    container?.add(light)

    const setProps = () => {
      ['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const newVal = props.position?.[key] ?? 0
        if (newVal !== light.position[key]) {
          light.position[key] = newVal
        }
      })

      const newColor = new THREE.Color(props.color)
      if (!light.color.equals(newColor)) {
        light.color = newColor
      }

      const intensity = props.intensity ?? 1
      if (light.intensity !== intensity) {
        light.intensity = intensity
      }

      const width = props.width ?? 10
      if (light.width !== width) {
        light.width = width
      }

      const height = props.height ?? 10
      if (light.height !== height) {
        light.height = height
      }
    }

    const revoke = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      revoke()
    })

    return () => (
      <div class='rect-area-light'>
        { slots.default?.() }
      </div>
    )
  }
})

export {
  AmbientLight,
  PointLight,
  DirectionalLight,
  HemisphereLight,
  RectAreaLight
}
