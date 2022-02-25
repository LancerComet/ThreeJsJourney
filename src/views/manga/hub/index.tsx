import { defineComponent } from 'vue'
import { useScene } from '../../../core.v2/scene'

const MangaHub = defineComponent({
  name: 'MangaHub',
  setup () {
    const { Scene } = useScene()

    return () => (
      <Scene>
      </Scene>
    )
  }
})

export {
  MangaHub
}
