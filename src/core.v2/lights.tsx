import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, PointLight, PointLightHelper } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getScene } from './scene'

const useAmbientLight = () => {
  return {
    AmbientLight: defineComponent({
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
        const ambientLight = new AmbientLight()

        const setProps = () => {
          const newColor = new Color(props.color)
          if (!ambientLight.color.equals(newColor)) {
            ambientLight.color = newColor
          }

          if (ambientLight.intensity !== props.intensity) {
            ambientLight.intensity = props.intensity
          }
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
        }
      },

      setup (props) {
        const pointLight = new PointLight(0xffffff, 0.5)
        const pointLightHelper = new PointLightHelper(pointLight)

        const setShadow = () => {
          pointLight.castShadow = props.castShadow === true
          pointLight.shadow.mapSize.width = props.shadowSize ?? 512
          pointLight.shadow.mapSize.height = props.shadowSize ?? 512
        }

        watch(props, () => {
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

          const newColor = new Color(props.color)
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
        }, {
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

const useDirectionalLight = () => {
  return {
    DirectionalLight: defineComponent({
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
        const light = new DirectionalLight(0xffffff, 0.5)
        const lightHelper = new DirectionalLightHelper(light)

        watch(props, () => {
          ['x', 'y', 'z'].forEach(item => {
            const key = item as 'x' | 'y' | 'z'
            const positionValue = props.position?.[key] ?? 0
            if (positionValue !== light.position[key]) {
              light.position[key] = positionValue
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

          const newColor = new Color(props.color)
          if (!light.color.equals(newColor)) {
            light.color = newColor
          }

          lightHelper.visible = props.showHelper === true
        }, {
          deep: true,
          immediate: true
        })

        const scene = getScene()
        if (scene) {
          scene.add(light)
          scene.add(lightHelper)
        }

        onBeforeUnmount(() => {
          light.dispose()
        })

        return () => (
          <div class='directional-light' data-uuid={light.uuid} />
        )
      }
    })
  }
}

export {
  useAmbientLight,
  usePointLight,
  useDirectionalLight
}
