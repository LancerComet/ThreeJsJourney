import { OrbitControls as Controls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectCamera } from '../providers/cameras'
import { injectOnTick } from '../providers/ontick'
import { injectRenderer } from '../providers/renderer'

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
      type: Object as PropType<{ x: number, y: number, z: number }>,
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
      ;['x', 'y', 'z'].forEach(item => {
        const key = item as 'x' | 'y' | 'z'
        const oldVal = props.target?.[key] ?? 0
        if (oldVal !== controls.target[key]) {
          controls.target[key] = oldVal
        }
      })
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
