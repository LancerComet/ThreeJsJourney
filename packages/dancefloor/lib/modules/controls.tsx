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

/**
 * Orbit Controls.
 *
 * @example
 * <Scene>
 *   <PerspectiveCamera>
 *     <OrbitControls />
 *   </PerspectiveCamera>
 * </Scene>
 */
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

    onTick?.(() => {
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

/**
 * Transform controls for a mesh object.
 *
 * @example
 * <Mesh>
 *   <BoxGeometry />
 *   <BasicMaterial />
 *   <TransformControls
 *     mode={controlModeRef.value}
 *     onDraggingChanged={event => {
 *       const isInDragging = event.value
 *       isOrbitControlEnabled.value = !isInDragging
 *     }}
 *   />
 * </Mesh>
 */
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
    space: {
      type: String as PropType<'local' | 'world'>,
      default: 'local'
    },
    snap: {
      type: Object as PropType<Partial<{ t: number | null, r: number | null, s: number | null }>>,
      default: () => ({
        t: null, r: null, s: null
      })
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

    if (camera && renderer && mesh && container) {
      controls = new ThreeTransformControls(camera, renderer.domElement)
      controls.attach(mesh)
      container.add(controls)
      controls.addEventListener('dragging-changed', onDraggingChanged as any)
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

      if (diff(props.space, controls.space)) {
        controls.setSpace(props.space)
      }

      const snapTransform = props.snap?.t ?? null
      if (diff(snapTransform, controls.translationSnap)) {
        controls.setTranslationSnap(snapTransform)
      }

      const snapRotation = props.snap?.r ?? null
      if (diff(snapRotation, controls.rotationSnap)) {
        controls.setRotationSnap(snapRotation)
      }

      const snapScale = props.snap?.s ?? null
      // @ts-ignore
      if (diff(snapScale, controls.scaleSnap)) {
        controls.setScaleSnap(snapScale)
      }
    })

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
