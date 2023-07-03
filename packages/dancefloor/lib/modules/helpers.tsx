import * as THREE from 'three'
import { RectAreaLightHelper as ThreeRectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'

import { injectContainer } from '../providers/container'
import { injectLight } from '../providers/light'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const AxesHelper = defineComponent({
  props: {
    position: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    },
    rotation: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    }
  },

  setup (props) {
    const helper = new THREE.AxesHelper()
    const container = injectContainer()
    container?.add(helper)

    const revokeWatch = watchEffect(() => {
      updateVector3(props.position, helper.position)
      updateVector3(props.rotation, helper.rotation)
    })

    const dispose = () => {
      helper.clear()
      helper.removeFromParent()
      helper.dispose()
    }

    onBeforeUnmount(() => {
      revokeWatch()
      dispose()
    })

    return () => (
      <div class='axes-helper' />
    )
  }
})

const GridHelper = defineComponent({
  name: 'GridHelper',

  props: {
    size: {
      type: Number as PropType<number>,
      default: 10
    },
    divisions: {
      type: Number as PropType<number>,
      default: 10
    },
    color1: Object as PropType<THREE.ColorRepresentation>,
    color2: Object as PropType<THREE.ColorRepresentation>
  },

  setup (props) {
    let helper: THREE.GridHelper | undefined
    const container = injectContainer()

    const createHelper = () => {
      if (container) {
        helper = new THREE.GridHelper(props.size, props.divisions, props.color1, props.color2)
        container.add(helper)
      }
    }

    const dispose = () => {
      helper?.clear()
      helper?.removeFromParent()
      helper?.dispose()
      helper = undefined
    }

    const revokeWatch = watchEffect(() => {
      dispose()
      createHelper()
    })

    onBeforeUnmount(() => {
      revokeWatch()
      dispose()
    })

    return () => (
      <div class='grid-helper'></div>
    )
  }
})

const HemisphereLightHelper = defineComponent({
  name: 'HemisphereLightHelper',

  props: {
    size: {
      type: Number as PropType<number>,
      required: true
    },
    color: [Number, Object] as PropType<THREE.ColorRepresentation>
  },

  setup (props) {
    let helper: THREE.HemisphereLightHelper
    const light = injectLight() as THREE.HemisphereLight
    const container = injectContainer()

    if (light && container) {
      helper = new THREE.HemisphereLightHelper(light, props.size, props.color)
      container.add(helper)
    }

    const setColor = () => {
      if (helper) {
        const newColor = new THREE.Color(props.color)
        const oldColor = new THREE.Color(helper.color)
        if (!newColor.equals(oldColor)) {
          helper.color = newColor
        }
      }
    }

    const revoke = watchEffect(() => {
      setColor()
    })

    const dispose = () => {
      container?.remove(helper)
      helper?.dispose()
    }

    onBeforeUnmount(() => {
      revoke()
      dispose()
    })

    return () => (
      <div class='hemisphere-light-helper' />
    )
  }
})

const InfiniteGridHelper = defineComponent({
  name: 'InfiniteGridHelper',
  props: {
    size1: {
      type: Number as PropType<number>,
      default: 2
    },
    size2: {
      type: Number as PropType<number>,
      default: 10
    },
    color: {
      type: [Object, Number, String] as PropType<THREE.ColorRepresentation>,
      default: 0xffffff
    },
    distance: {
      type: Number as PropType<number>,
      default: 8000
    }
  },
  setup (props) {
    const { size1, size2, color, distance } = props
    const axes = 'xyz'
    const planeAxes = axes.substr(0, 2)
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uSize1: { value: size1 },
        uSize2: { value: size2 },
        uColor: { value: new THREE.Color(color) },
        uDistance: { value: distance }
      },
      transparent: true,
      vertexShader: `
          varying vec3 worldPosition;
          uniform float uDistance;
          void main() {
            vec3 pos = position.${axes} * uDistance;
            pos.${planeAxes} += cameraPosition.${planeAxes};
            worldPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }`,
      fragmentShader: `
          varying vec3 worldPosition;
          uniform float uSize1;
          uniform float uSize2;
          uniform vec3 uColor;
          uniform float uDistance;
          float getGrid(float size) {
            vec2 r = worldPosition.${planeAxes} / size;
            vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
            float line = min(grid.x, grid.y);
            return 1.0 - min(line, 1.0);
          }
          void main() {
            float d = 1.0 - min(distance(cameraPosition.${planeAxes}, worldPosition.${planeAxes}) / uDistance, 1.0);
            float g1 = getGrid(uSize1);
            float g2 = getGrid(uSize2);
            gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
            gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
            if (gl_FragColor.a <= 0.0) discard;
          }`,
      extensions: { derivatives: true }
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    mesh.rotation.x = Math.PI / 2

    const container = injectContainer()
    container?.add(mesh)

    onBeforeUnmount(() => {
      geometry.dispose()
      material.dispose()
      mesh.clear()
      mesh.removeFromParent()
    })

    return () => (
      <div class='infinite-grid-helper' />
    )
  }
})

const RectAreaLightHelper = defineComponent({
  name: 'RectAreaLightHelper',

  props: {
    color: [Number, Object] as PropType<THREE.ColorRepresentation>
  },

  setup (props) {
    let helper: ThreeRectAreaLightHelper
    const light = injectLight() as THREE.RectAreaLight
    const container = injectContainer()

    if (light && container) {
      helper = new ThreeRectAreaLightHelper(light, props.color)
      container.add(helper)
    }

    const setColor = () => {
      if (helper) {
        const newColor = new THREE.Color(props.color)
        const oldColor = new THREE.Color(helper.color)
        if (!newColor.equals(oldColor)) {
          helper.color = newColor
        }
      }
    }

    const revoke = watchEffect(() => {
      setColor()
    })

    const dispose = () => {
      container?.remove(helper)
      helper?.dispose()
    }

    onBeforeUnmount(() => {
      revoke()
      dispose()
    })

    return () => (
      <div class='rect-area-light-helper' />
    )
  }
})

export {
  AxesHelper,
  GridHelper,
  HemisphereLightHelper,
  InfiniteGridHelper,
  RectAreaLightHelper
}
