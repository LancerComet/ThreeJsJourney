import { onBeforeUnmount } from 'vue'

const useResize = (handler: (event: Event) => void) => {
  window.addEventListener('resize', handler)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler)
  })
}

export {
  useResize
}
