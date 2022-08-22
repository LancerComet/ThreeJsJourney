import { Mesh } from 'three'
import { Bend, ModifierStack } from 'three.modifiers'
import { CubicBezier } from '../../../modules/cubic-bezier'
import { getFps } from '../../../modules/fps'
import { clampNumber } from '../../../utils'

const useFlip = (param: {
  mesh: Mesh
  bend: Bend
  modifier: ModifierStack
  index: number
  totalPage: number
  pageOffset: number
  cubicBezier: CubicBezier
  emit: (eventName: string, ...args: unknown[]) => void
}) => {
  const {
    mesh, bend, modifier,
    index, totalPage, pageOffset,
    cubicBezier, emit
  } = param

  let flipPercent = 0
  let stopper: (() => void) | undefined

  const setFlipPercent = (isForward: boolean, percent: number) => {
    flipPercent = clampNumber(percent, 0, 1)

    // 精度问题, 1 的时候应当为 0 但给了一个小数, 这里复写.
    const force = percent === 1 ? 0 : Math.sin(percent * Math.PI)
    bend.force = isForward
      ? force * 0.88 // 给个小数倍率尽量避免穿模.
      : force * -0.88
    modifier.apply()

    mesh.rotation.y = Math.min(percent, 1) * Math.PI

    const positionFlipped = (totalPage - index - 1) * -pageOffset
    const positionOrigin = index * -pageOffset
    mesh.position.z = isForward
      ? positionOrigin + percent * (positionFlipped - positionOrigin)
      : positionFlipped - (1 - percent) * (positionFlipped - positionOrigin)
  }

  const flipStepsAt60Fps = 60
  const flipExec = (isForward: boolean, endOverride?: number, doEmit: boolean = false) => {
    let end = isForward ? 1 : 0
    if (typeof endOverride === 'number') {
      end = clampNumber(endOverride, 0, 1)
    }

    if (flipPercent === end) {
      return
    }

    const baseStep = isForward
      ? flipStepsAt60Fps * (1 - flipPercent)
      : flipStepsAt60Fps * flipPercent
    const stepRatio = getFps() / 60
    const steps = Math.floor(Math.max(baseStep, Math.floor(baseStep * stepRatio)))

    stopper?.()
    stopper = cubicBezier.tick(flipPercent, end, steps, (percent, isDone) => {
      setFlipPercent(isForward, percent)
      if (isDone) {
        stopper = undefined
        if (doEmit) {
          isForward ? emit('manualFlip', index) : emit('manualBackward', index)
        }
      }
    })
  }

  const flip = () => flipExec(true)
  const backward = () => flipExec(false)
  const flipFromCurrentPercent = (isForward: boolean, distPercent: number) => {
    flipExec(isForward, distPercent, true)
  }

  return {
    flip,
    backward,
    flipFromCurrentPercent,
    setFlipPercent,
    stopper: () => stopper?.(),
    getFlipPercent: () => flipPercent
  }
}

export {
  useFlip
}
