import { onBeforeUnmount } from 'vue'

const useResize = (handler: () => void) => {
  window.addEventListener('resize', handler)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler)
  })
  handler()
}

export {
  useResize
}
