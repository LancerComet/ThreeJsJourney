import { MangaPageVM } from '../components/manga-reader'
import { clampNumber } from '../utils'

const usePointerControl = (param: {
  moveThreshold?: number // 触摸防抖像素值.
  moveTotalDistance?: number // 总体移动像素距离.
  flipProgress?: number // 移动翻页百分比.
  getIndex: () => number
  getMangaPageVms: () => MangaPageVM[]
  onFlip: (pageIndex: number) => void
  onBackward: (pageIndex: number) => void
}) => {
  let isEnabled: boolean = false
  const moveThreshold = param.moveThreshold ?? 5
  const moveTotalDistance = param.moveTotalDistance ?? clampNumber(window.innerWidth * 0.4, 250, 1920)
  const flipProgress = param.flipProgress ?? 0.4
  const { getIndex, getMangaPageVms, onFlip, onBackward } = param

  let isPointerDown = false
  let pointerDownX = 0
  let lastMoveX = 0
  let startFlipProgress = 0

  let targetIndex: number = -1
  let targetPageVM: MangaPageVM | undefined

  const resetState = () => {
    isPointerDown = false
    pointerDownX = 0
    lastMoveX = 0
    startFlipProgress = 0
    targetIndex = -1
    targetPageVM = undefined
  }

  const moveExec = (offsetX: number) => {
    const moveDelta = offsetX - lastMoveX
    if (Math.abs(moveDelta) < moveThreshold) {
      return
    }

    if (!targetPageVM) {
      const pageVMs = getMangaPageVms()
      let index = -1
      if (moveDelta > 0) {
        index = getIndex()
      } else {
        index = getIndex() - 1
      }
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

  const onPointerDown = (event: PointerEvent) => {
    if (!isEnabled) {
      return
    }

    isPointerDown = true
    pointerDownX = event.offsetX
    lastMoveX = event.offsetX
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!isEnabled || !isPointerDown) {
      return
    }
    event.preventDefault()
    moveExec(event.offsetX)
  }

  const onPointerUp = () => {
    if (!isEnabled || !isPointerDown) {
      return
    }

    if (targetPageVM) {
      const currentFlipPercent = targetPageVM.getFlipPercent()
      const deltaPercent = Math.abs(currentFlipPercent - startFlipProgress)

      const doFlipTo0 = startFlipProgress < 0.5 && deltaPercent <= flipProgress
      const doFlipTo1 = startFlipProgress < 0.5 && deltaPercent > flipProgress
      const backwardTo0 = startFlipProgress >= 0.5 && deltaPercent > flipProgress
      const backwardTo1 = startFlipProgress >= 0.5 && deltaPercent <= flipProgress

      if (doFlipTo0) {
        targetPageVM.flipFromCurrentPercent(true, 0)
      } else if (doFlipTo1) {
        targetPageVM.flipFromCurrentPercent(true, 1)
        onFlip(targetIndex)
      } else if (backwardTo0) {
        targetPageVM.flipFromCurrentPercent(false, 0)
        onBackward(targetIndex)
      } else if (backwardTo1) {
        targetPageVM.flipFromCurrentPercent(false, 1)
      }
    }

    resetState()
  }

  const onTouchMove = (event: TouchEvent) => {
    const touches = event.touches
    const touch = touches[0]
    if (!touch || !isEnabled || !isPointerDown) {
      return
    }

    event.preventDefault()
    const offsetX = touch.clientX
    moveExec(offsetX)
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
