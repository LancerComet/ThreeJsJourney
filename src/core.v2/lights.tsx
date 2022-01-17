import { AmbientLight, Color, PointLight, PointLightHelper } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getScene } from './scene'

const useAmbientLight = () => {
  return {
    AmbientLight: defineComponent({
      props: {
        castShadow: Boolean as PropType<boolean>,
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
        const ambientLight = new AmbientLight()

        const setProps = () => {
          ambientLight.color = new Color(props.color)
          ambientLight.intensity = props.intensity
          ambientLight.castShadow = props.castShadow === true
        }

        watch(props, setProps, {
          deep: true,
          immediate: true
        })

        const scene = getScene()
        if (scene) {
          scene.add(ambientLight)
        }
        return () => (
          <div class='ambient-light' data-uuid={ambientLight.uuid} />
        )
      }
    })
  }
}

const usePointLight = () => {
  return {
    PointLight: defineComponent({
      props: {
        castShadow: {
          type: Boolean as PropType<boolean>,
          default: false
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
          type: Object as PropType<{ x: number, y: number, z: number }>,
          default: () => ({ x: 0, y: 0, z: 0 })
        },
        showHelper: {
          type: Boolean as PropType<boolean>,
          default: false
        }
      },

      setup (props) {
        const pointLight = new PointLight(0xffffff, 0.5)
        const pointLightHelper = new PointLightHelper(pointLight)

        const setProps = () => {
          pointLight.color = new Color(props.color)
          pointLight.intensity = props.intensity
          pointLight.castShadow = props.castShadow === true

          const { x, y, z } = props.position
          pointLight.position.set(x, y, z)

          pointLightHelper.visible = props.showHelper === true
        }

        watch(props, setProps, {
          deep: true,
          immediate: true
        })

        const scene = getScene()
        if (scene) {
          scene.add(pointLight)
          scene.add(pointLightHelper)
        }

        onBeforeUnmount(() => {
          pointLight.dispose()
        })

        return () => (
          <div class='point-light' data-uuid={pointLight.uuid} />
        )
      }
    })
  }
}

export {
  useAmbientLight,
  usePointLight
}