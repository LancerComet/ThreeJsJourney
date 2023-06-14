import * as THREE from 'three'
import { HemisphereLightHelper as ThreeHemisphereLightHelper } from 'three'
import { RectAreaLightHelper as ThreeRectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { defineComponent, onBeforeUnmount, PropType, watch, watchEffect } from 'vue'

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
    const axesHelper = new THREE.AxesHelper()
    const container = injectContainer()
    container?.add(axesHelper)

    const setProps = () => {
      updateVector3(props.position, axesHelper.position)
      updateVector3(props.rotation, axesHelper.rotation)
    }

    const revoke = watch(props, setProps, {
      deep: true,
      immediate: true
    })

    onBeforeUnmount(revoke)

    return () => (
      <div class='axes-helper' />
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
    let helper: ThreeHemisphereLightHelper
    const light = injectLight() as THREE.HemisphereLight
    const container = injectContainer()

    if (light && container) {
      helper = new ThreeHemisphereLightHelper(light, props.size, props.color)
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

export {
  AxesHelper,
  RectAreaLightHelper,
  HemisphereLightHelper
}
