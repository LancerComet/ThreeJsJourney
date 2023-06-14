import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType } from 'vue'
import { injectClock } from '../providers/clock'
import { injectGeometry } from '../providers/geometry'
import { injectMesh } from '../providers/mesh'
import { injectOnTick } from '../providers/ontick'

/**
 * Modifier is a component which allows you to use the injected objects such as Mesh or Geometry.
 *
 * The type of injected objects depends on where it locates.
 * You can put it anywhere you like.
 *
 * @example
 * <Mesh>
 *   <BoxGeometry>
 *     <Modifier onTick={param => {
 *       const clock = param.clock  // This is the global clock.
 *       const geometry = param.geometry  // This is the BoxGeometry.
 *     }} />
 *   </BoxGeometry>
 *   <StandardMaterial />
 * </Mesh>
 */
const Modifier = defineComponent({
  name: 'Modifier',

  props: {
    onTick: {
      type: Function as PropType<(param: {
        mesh?: THREE.Mesh | THREE.Points
        geometry?: THREE.BufferGeometry
        clock?: THREE.Clock
      }) => void>
    }
  },

  setup (props) {
    const geometry = injectGeometry()
    const mesh = injectMesh()
    const onTick = injectOnTick()
    const clock = injectClock()

    const removeOnTick = onTick?.(() => {
      props.onTick?.({
        geometry,
        mesh,
        clock
      })
    })

    onBeforeUnmount(() => {
      removeOnTick?.()
    })

    return () => (
      <div class='modifier' />
    )
  }
})

export {
  Modifier
}
