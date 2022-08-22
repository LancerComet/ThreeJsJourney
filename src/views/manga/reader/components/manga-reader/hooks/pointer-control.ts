import { BufferGeometry, EventListener, Mesh, ShaderMaterial } from 'three'
import * as THREE from 'three'
import { clampNumber } from '../../../utils'

type EventHandler = EventListener<THREE.Event, string, Mesh<BufferGeometry, ShaderMaterial>>

const usePointerControl = (param: {
  mesh: Mesh,
  moveThreshold?: number
  moveTotalDistance?: number
  flipDistance?: number
  stopFlipping: () => void
  getFlipPercent: () => number
  setFlipPercent: (isForward: boolean, percent: number) => void
  flipFromCurrentPercent: (isForward: boolean, distPercent: number) => void
}) => {
  let isEnabled: boolean = false
  const moveThreshold = param.moveThreshold ?? 5
  const moveTotalDistance = param.moveTotalDistance ?? clampNumber(window.innerWidth * 0.4, 250, 1920)
  const { mesh, setFlipPercent, getFlipPercent, flipFromCurrentPercent, stopFlipping } = param

  let isPointerDown = false
  let pointerDownX = 0
  let lastMoveX = 0
  let startFlipProgress = 0
  let moveDirection: 'flip' | 'backward' = 'flip'

  const onPointerDown: EventHandler = (event) => {
    if (!isEnabled) {
      return
    }

    event.stopPropagation()
    isPointerDown = true
    const originalEvent = event.originalEvent as PointerEvent
    pointerDownX = originalEvent.offsetX
    startFlipProgress = getFlipPercent()
    stopFlipping()
  }

  const onPointerUp = (event: Event) => {
    if (!isEnabled || !isPointerDown) {
      return
    }

    event.stopPropagation()

    const currentFlipPercent = getFlipPercent()
    const deltaPercent = Math.abs(currentFlipPercent - startFlipProgress)
    if (deltaPercent > 0) {
      if (moveDirection === 'flip') {
        flipFromCurrentPercent(true, deltaPercent <= 0.4 ? 0 : 1)
      } else {
        flipFromCurrentPercent(false, deltaPercent <= 0.4 ? 1 : 0)
      }
    }

    isPointerDown = false
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

    moveDirection = moveDelta > 0 ? 'flip' : 'backward'

    const moveDistance = offsetX - pointerDownX
    const movePercent = moveDistance / moveTotalDistance
    const percent = clampNumber(startFlipProgress + movePercent, 0, 1)
    setFlipPercent(startFlipProgress <= 0.3, percent)
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
    setFlipPercent(startFlipProgress <= 0.3, percent)
    lastMoveX = offsetX
  }

  mesh.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onPointerUp)

  const dispose = () => {
    mesh.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onPointerUp)
  }

  return {
    dispose,
    setEnabled: (newState: boolean) => {
      isEnabled = newState
    }
  }
}

export {
  usePointerControl
}
