import { OrbitControls as Controls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectCamera } from '../providers/cameras'
import { injectOnTick } from '../providers/ontick'
import { injectRenderer } from '../providers/renderer'
import { IVector3 } from '../types'
import { updateVector3 } from '../utils/manipulation'

const OrbitControls = defineComponent({
  name: 'OrbitControls',

  props: {
    enableDamping: {
      type: Boolean,
      default: true
    },
    dampingFactor: {
      type: Number as PropType<number>,
      default: 0.1
    },
    enabled: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    target: {
      type: Object as PropType<Partial<IVector3>>,
      default: () => ({})
    }
  },

  setup (props) {
    const camera = injectCamera()
    const renderer = injectRenderer()
    const onTick = injectOnTick()
    const controls = new Controls(camera!, renderer?.domElement)

    const disposeOnTick = onTick?.(() => {
      controls.update()
    })

    const setProps = () => {
      controls.enableDamping = props.enableDamping
      controls.dampingFactor = props.dampingFactor
      controls.enabled = props.enabled
      updateVector3(props.target, controls.target)
    }

    const revoke = watchEffect(() => {
      setProps()
    })

    onBeforeUnmount(() => {
      revoke()
      disposeOnTick?.()
      controls.dispose()
    })

    return () => (
      <div class='orbit-controls'></div>
    )
  }
})

export {
  OrbitControls
}
