import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const AppLayout = defineComponent({
  setup () {
    return () => (
      <div>
        <RouterView />
      </div>
    )
  }
})

export {
  AppLayout
}
