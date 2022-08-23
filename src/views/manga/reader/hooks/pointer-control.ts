import { MangaPageVM } from '../components/manga-reader'
import { clampNumber } from '../utils'

const usePointerControl = (param: {
  moveThreshold?: number
  moveTotalDistance?: number
  flipDistance?: number
  getIndex: () => number
  getMangaPageVms: () => MangaPageVM[]
  onFlip: (pageIndex: number) => void
  onBackward: (pageIndex: number) => void
}) => {
  let isEnabled: boolean = false
  const moveThreshold = param.moveThreshold ?? 5
  const moveTotalDistance = param.moveTotalDistance ?? clampNumber(window.innerWidth * 0.4, 250, 1920)
  const { getIndex, getMangaPageVms, onFlip, onBackward } = param

  let isPointerDown = false
  let pointerDownX = 0
  let lastMoveX = 0
  let startFlipProgress = 0
  let moveDirection: 'flip' | 'backward' | 'none' = 'none'

  let targetIndex: number = -1
  let targetPageVM: MangaPageVM | undefined

  const onPointerDown = (event: PointerEvent) => {
    if (!isEnabled) {
      return
    }

    event.stopPropagation()
    isPointerDown = true
    pointerDownX = event.offsetX
    lastMoveX = event.offsetX
  }

  const onPointerUp = (event: Event) => {
    if (!isEnabled || !isPointerDown) {
      return
    }

    event.stopPropagation()

    if (targetPageVM) {
      const currentFlipPercent = targetPageVM.getFlipPercent()
      const deltaPercent = Math.abs(currentFlipPercent - startFlipProgress)
      if (deltaPercent > 0) {
        if (moveDirection === 'flip') {
          const isFlipped = deltaPercent > 0.4
          targetPageVM.flipFromCurrentPercent(true, isFlipped ? 1 : 0)
          if (isFlipped) {
            onFlip(targetIndex)
          }
        } else {
          const isBackward = deltaPercent > 0.4
          targetPageVM.flipFromCurrentPercent(false, isBackward ? 0 : 1)
          if (isBackward) {
            onBackward(targetIndex)
          }
        }
      }
    }

    targetIndex = -1
    targetPageVM = undefined
    isPointerDown = false
    lastMoveX = 0
    moveDirection = 'none'
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!isEnabled || !isPointerDown) {
      return
    }

    const offsetX = event.offsetX
    const moveDelta = offsetX - lastMoveX
    if (Math.abs(moveDelta) < moveThreshold) {
      return
    }

    moveDirection = moveDelta > 0
      ? 'flip'
      : moveDelta < 0
        ? 'backward'
        : 'none'

    if (!targetPageVM) {
      const pageVMs = getMangaPageVms()
      let index = -1
      if (moveDirection === 'flip') {
        index = getIndex()
      } else if (moveDirection === 'backward') {
        index = getIndex() - 1
      }
      console.log(index, moveDirection, moveDelta)
      if (index >= 0) {
        targetIndex = index
        targetPageVM = pageVMs[index]
        targetPageVM?.stopFlipping()
        startFlipProgress = targetPageVM.getFlipPercent()
      }
    }

    const moveDistance = offsetX - pointerDownX
    const movePercent = moveDistance / moveTotalDistance
    const percent = clampNumber(startFlipProgress + movePercent, 0, 1)
    targetPageVM?.setFlipPercent(startFlipProgress <= 0.3, percent)

    lastMoveX = offsetX
  }

  const onTouchMove = (event: TouchEvent) => {
    const touches = event.touches
    const touch = touches[0]
    if (!touch) {
      return
    }

    if (!isEnabled || !isPointerDown) {
      return
    }
    const offsetX = touch.clientX
    const moveDelta = offsetX - lastMoveX
    if (Math.abs(moveDelta) < moveThreshold) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    moveDirection = moveDelta > 0 ? 'flip' : 'backward'

    const moveDistance = offsetX - pointerDownX
    const movePercent = moveDistance / moveTotalDistance
    const percent = clampNumber(startFlipProgress + movePercent, 0, 1)
    targetPageVM?.setFlipPercent(startFlipProgress <= 0.3, percent)
    lastMoveX = offsetX
  }

  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onPointerUp)

  const dispose = () => {
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onPointerUp)
  }

  const setEnabled = (newState: boolean) => {
    isEnabled = newState
  }

  return {
    dispose,
    setEnabled
  }
}

export {
  usePointerControl
}
