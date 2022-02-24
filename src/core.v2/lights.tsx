import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, PointLight, PointLightHelper } from 'three'
import { defineComponent, onBeforeUnmount, PropType, watch } from 'vue'
import { getScene } from './scene'
import { checkObjEqual } from './utils'

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

        watch(props, (_, oldVal) => {
          if (oldVal?.color !== props.color) {
            ambientLight.color = new Color(props.color)
          }

          if (oldVal?.intensity !== props.intensity) {
            ambientLight.intensity = props.intensity
          }
        }, {
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

        const setShadow = () => {
          pointLight.castShadow = props.castShadow === true
          pointLight.shadow.mapSize.width = props.shadowSize ?? 512
          pointLight.shadow.mapSize.height = props.shadowSize ?? 512
        }

        const setPosition = () => {
          const { x, y, z } = props.position
          pointLight.position.set(x, y, z)
        }

        watch(props, (_, oldVal) => {
          const isPositionChanged = !checkObjEqual(oldVal?.position, props.position)
          if (isPositionChanged) {
            setPosition()
          }

          const isShadowChanged = (oldVal?.castShadow !== props.castShadow) ||
            (oldVal?.shadowSize !== props.shadowSize)
          if (isShadowChanged) {
            setShadow()
          }

          if (oldVal?.intensity !== props.intensity) {
            pointLight.intensity = props.intensity
          }

          if (oldVal?.color !== props.color) {
            pointLight.color = new Color(props.color)
          }

          if (oldVal?.distance !== props.distance) {
            pointLight.distance = props.distance ?? 0
          }

          if (oldVal?.decay !== props.decay) {
            pointLight.decay = props.decay ?? 1
          }

          if (oldVal?.showHelper !== props.showHelper) {
            pointLightHelper.visible = props.showHelper === true
          }
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
          type: Object as PropType<{ x: number, y: number, z: number }>,
          default: () => ({ x: 0, y: 0, z: 0 })
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

        const setShadow = () => {
          light.castShadow = props.castShadow === true
          light.shadow.mapSize.width = props.shadowSize ?? 512
          light.shadow.mapSize.height = props.shadowSize ?? 512

          // light.shadow.camera.top = props.shadowCamera?.top ?? 1
          // light.shadow.camera.bottom = props.shadowCamera?.bottom ?? -1
          // light.shadow.camera.left = props.shadowCamera?.left ?? -1
          // light.shadow.camera.right = props.shadowCamera?.right ?? 1
          light.shadow.camera.near = props.shadowCamera?.near ?? 0.1
          light.shadow.camera.far = props.shadowCamera?.far ?? 2000
        }

        const setPosition = () => {
          const { x, y, z } = props.position
          light.position.set(x, y, z)
        }

        watch(props, (_, oldVal) => {
          const isPositionChanged = !checkObjEqual(oldVal?.position, props.position)
          if (isPositionChanged) {
            setPosition()
          }

          const isShadowChanged = (oldVal?.castShadow !== props.castShadow) ||
            (oldVal?.shadowSize !== props.shadowSize) ||
            (!checkObjEqual(oldVal?.shadowCamera, props.shadowCamera))
          if (isShadowChanged) {
            setShadow()
          }

          if (oldVal?.intensity !== props.intensity) {
            light.intensity = props.intensity
          }

          if (oldVal?.color !== props.color) {
            light.color = new Color(props.color)
          }

          if (oldVal?.showHelper !== props.showHelper) {
            lightHelper.visible = props.showHelper === true
          }
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
