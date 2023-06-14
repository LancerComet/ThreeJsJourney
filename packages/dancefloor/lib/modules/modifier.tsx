import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType } from 'vue'
import { injectClock } from '../providers/clock'
import { injectGeometry } from '../providers/geometry'
import { injectMesh } from '../providers/mesh'
import { injectOnTick } from '../providers/ontick'

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
