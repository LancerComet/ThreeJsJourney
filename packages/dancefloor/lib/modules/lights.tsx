import * as THREE from 'three'
import { defineComponent, inject, onBeforeUnmount, PropType, provide, watch, watchEffect } from 'vue'
import { injectContainer } from '../providers/container'
import { provideLight } from '../providers/light'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const PROVIDE_KEY_DIRECTIONAL_LIGHT = 'three:directional-light'

const AmbientLight = defineComponent({
  props: {
    color: {
      type: [Number, String, THREE.Color] as PropType<THREE.ColorRepresentation>,
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

    const revokeWatch = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    const container = injectContainer()
    if (container) {
      container.add(ambientLight)
    }

    onBeforeUnmount(() => {
      revokeWatch()

      ambientLight.dispose()
      container?.remove(ambientLight)
    })

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
      type: [Number, String, THREE.Color] as PropType<THREE.ColorRepresentation>,
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
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },
    hide: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    showHelper: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    /**
     * LightHelper config.
     * Please notice this object is not reactive.
     */
    helper: {
      type: Object as PropType<{
        size?: number
        color?: THREE.ColorRepresentation
      }>
    }
  },

  setup (props) {
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    const pointLightHelper = new THREE.PointLightHelper(
      pointLight,
      props.helper?.size,
      props.helper?.color
    )

    const revoke = watchEffect(() => {
      updateVector3(props.position, pointLight.position)

      const shadowSize = props.shadowSize

      if (pointLight.shadow.mapSize.width !== shadowSize) {
        pointLight.shadow.mapSize.width = shadowSize
      }

      if (pointLight.shadow.mapSize.height !== shadowSize) {
        pointLight.shadow.mapSize.height = shadowSize
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

      pointLight.castShadow = props.castShadow
      pointLight.visible = !props.hide

      pointLightHelper.visible = props.showHelper
      pointLightHelper.update()
    })

    const container = injectContainer()
    if (container) {
      container.add(pointLight)
      container.add(pointLightHelper)
    }

    onBeforeUnmount(() => {
      pointLightHelper.dispose()
      container?.remove(pointLightHelper)
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

    shadow: {
      type: Object as PropType<{
        mapSize?: { width?: number, height?: number }
        camera?: { near?: number, far?: number }
      }>,
      default: () => ({
        mapSize: { width: 512, height: 512 },
        camera: { near: 0.5, far: 500 }
      })
    },

    color: {
      type: [Number, String, THREE.Color] as PropType<THREE.ColorRepresentation>,
      default: 0xffffff
    },

    intensity: {
      type: Number as PropType<number>,
      default: 0.5
    },

    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },

    showHelper: {
      type: Boolean as PropType<boolean>,
      default: false
    },

    /**
     * LightHelper config.
     * Please notice this object is not reactive.
     */
    helper: {
      type: Object as PropType<{
        size?: number
        color?: THREE.ColorRepresentation
      }>
    }
  },

  setup (props, { slots }) {
    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    const lightHelper = new THREE.DirectionalLightHelper(
      light,
      props.helper?.size,
      props.helper?.color
    )

    provide(PROVIDE_KEY_DIRECTIONAL_LIGHT, {
      light,
      lightHelper
    })

    const setProps = () => {
      updateVector3(props.position, light.position)

      if (light.castShadow !== props.castShadow) {
        light.castShadow = props.castShadow
      }

      const shadowWidth = props.shadow?.mapSize?.width ?? 512
      if (light.shadow.mapSize.width !== shadowWidth) {
        light.shadow.mapSize.width = shadowWidth
      }

      const shadowHeight = props.shadow?.mapSize?.height ?? 512
      if (light.shadow.mapSize.height !== shadowHeight) {
        light.shadow.mapSize.height = shadowHeight
      }

      const cameraNear = props.shadow?.camera?.near ?? 0.5
      if (cameraNear !== light.shadow.camera.near) {
        light.shadow.camera.near = cameraNear
      }

      const cameraFar = props.shadow?.camera?.far ?? 500
      if (cameraFar !== light.shadow.camera.far) {
        light.shadow.camera.far = cameraFar
      }

      if (light.intensity !== props.intensity) {
        light.intensity = props.intensity
      }

      const newColor = new THREE.Color(props.color)
      if (!light.color.equals(newColor)) {
        light.color = newColor
        lightHelper.update() // Update the helper's color.
      }

      lightHelper.visible = props.showHelper
    }

    const revokeSetProps = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    const container = injectContainer()
    if (container) {
      container.add(light)
      container.add(lightHelper)
    }

    onBeforeUnmount(() => {
      revokeSetProps()

      lightHelper.dispose()
      container?.remove(lightHelper)

      light.dispose()
      container?.remove(light)
    })

    return () => (
      <div class='directional-light'>{ slots.default?.() }</div>
    )
  }
})

const DirectionalLightTarget = defineComponent({
  name: 'DirectionalLightTarget',

  props: {
    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    }
  },

  setup (props) {
    const { light, lightHelper } = inject(PROVIDE_KEY_DIRECTIONAL_LIGHT) as {
      light: THREE.DirectionalLight
      lightHelper: THREE.DirectionalLightHelper
    }
    const obj = new THREE.Object3D()

    const container = injectContainer()
    if (container) {
      container.add(obj)
    }

    const setProps = () => {
      updateVector3(props.position, obj.position)

      if (light && light.target !== obj) {
        light.target = obj
      }

      // Need to update the light helper to make changes take effect.
      lightHelper.update()
    }

    const revokeWatch = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(() => {
      revokeWatch()
      obj.removeFromParent()
    })

    return () => (
      <div class='directional-light-target' />
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
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const light = new THREE.HemisphereLight(props.skyColor, props.groundColor, props.intensity)
    provideLight(light)

    const container = injectContainer()
    container?.add(light)

    const revokeWatch = watchEffect(() => {
      updateVector3(props.position, light.position)

      const newGroundColor = new THREE.Color(props.groundColor)
      if (!light.groundColor.equals(newGroundColor)) {
        light.groundColor.set(newGroundColor)
      }

      const newSkyColor = new THREE.Color(props.skyColor)
      if (!light.color.equals(newSkyColor)) {
        light.color.set(newSkyColor)
      }

      light.visible = !props.hide
    })

    onBeforeUnmount(() => {
      revokeWatch()

      container?.remove(light)
      light.dispose()
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
      type: [Number, String, THREE.Color] as PropType<THREE.ColorRepresentation>,
      default: 0xffffff
    },
    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    }
  },

  setup (props, { slots }) {
    const light = new THREE.RectAreaLight(props.color, props.intensity, props.width, props.height)
    provideLight(light)

    const container = injectContainer()
    container?.add(light)

    const setProps = () => {
      updateVector3(props.position, light.position)

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

      container?.remove(light)
      light.dispose()
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
  DirectionalLightTarget,
  HemisphereLight,
  RectAreaLight
}
