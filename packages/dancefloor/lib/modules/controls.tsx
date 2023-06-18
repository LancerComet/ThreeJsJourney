import { OrbitControls as ThreeOribitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls as ThreeTransformControls } from 'three/examples/jsm/controls/TransformControls'
import { defineComponent, onBeforeUnmount, PropType, watchEffect } from 'vue'
import { injectCamera } from '../providers/cameras'
import { injectContainer } from '../providers/container'
import { injectMesh } from '../providers/mesh'
import { injectOnTick } from '../providers/ontick'
import { injectRenderer } from '../providers/renderer'
import { IVector3 } from '../types'
import { diff } from '../utils/diff'
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
    const controls = new ThreeOribitControls(camera!, renderer?.domElement)

    const disposeOnTick = onTick?.(() => {
      controls.update()
    })

    const setProps = () => {
      if (diff(controls.enableDamping, props.enableDamping)) {
        controls.enableDamping = props.enableDamping
      }
      if (diff(controls.dampingFactor, props.dampingFactor)) {
        controls.dampingFactor = props.dampingFactor
      }
      if (diff(controls.enabled, props.enabled)) {
        controls.enabled = props.enabled
      }
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

type TransformControlsOnDraggingChangedEvent = {
  type: 'dragging-changed'
  target: ThreeTransformControls
  value: boolean
}

const TransformControls = defineComponent({
  name: 'TransformControls',

  props: {
    mode: {
      type: String as PropType<'translate' | 'rotate' | 'scale'>,
      default: 'translate'
    },
    size: {
      type: Number as PropType<number>,
      default: 1
    },
    onDraggingChanged: {
      type: Function as PropType<(event: TransformControlsOnDraggingChangedEvent) => void>
    }
  },

  emits: ['draggingChanged'],

  setup (props, { emit }) {
    const camera = injectCamera()
    const renderer = injectRenderer()
    const mesh = injectMesh()
    const container = injectContainer()

    let controls: ThreeTransformControls

    const onDraggingChanged = (event: TransformControlsOnDraggingChangedEvent) => {
      emit('draggingChanged', event)
    }

    const revokeWatch = watchEffect(() => {
      if (!controls) {
        return
      }

      if (diff(props.mode, controls.mode)) {
        controls.mode = props.mode
      }

      if (diff(props.size, controls.size)) {
        controls.size = props.size
      }
    })

    if (camera && renderer) {
      controls = new ThreeTransformControls(camera, renderer.domElement)
      controls.mode = props.mode
      controls.size = props.size
      mesh && controls.attach(mesh)
      container && container.add(controls)
      controls.addEventListener('dragging-changed', onDraggingChanged as any)
    }

    onBeforeUnmount(() => {
      revokeWatch()
      controls?.removeEventListener('dragging-changed', onDraggingChanged as any)
      controls?.removeFromParent()
      controls?.detach()
      controls?.dispose()
    })

    return () => (
      <div class='transform-controls'></div>
    )
  }
})

export {
  OrbitControls,
  TransformControls
}
