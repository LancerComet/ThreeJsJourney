import { CubicBezier } from '../../../modules/cubic-bezier'
import { getFps } from '../../../modules/fps'
import { clampNumber } from '../../../utils'

const useFlip = (param: {
  index: number
  totalPage: number
  pageOffset: number
  cubicBezier: CubicBezier
  setPosition: (position: Partial<{ x: number, y: number, z: number }>) => void
  setRotation: (position: Partial<{ x: number, y: number, z: number }>) => void
  setForce: (force: number) => void
}) => {
  const {
    index, totalPage, pageOffset,
    cubicBezier,
    setPosition, setForce, setRotation
  } = param

  let flipPercent = 0
  let stopper: (() => void) | undefined

  const setFlipPercent = (isForward: boolean, percent: number) => {
    flipPercent = clampNumber(percent, 0, 1)

    // 精度问题, 1 的时候应当为 0 但给了一个小数, 这里复写.
    const force = percent === 1 ? 0 : Math.sin(percent * Math.PI)
    setForce(
      isForward
        ? force * 0.88 // 给个小数倍率尽量避免穿模.
        : force * -0.88
    )

    const positionFlipped = (totalPage - index - 1) * -pageOffset
    const positionOrigin = index * -pageOffset

    setRotation({
      y: Math.min(percent, 1) * Math.PI
    })

    setPosition({
      z: isForward
        ? positionOrigin + percent * (positionFlipped - positionOrigin)
        : positionFlipped - (1 - percent) * (positionFlipped - positionOrigin)
    })
  }

  const flipStepsAt60Fps = 60
  const flipExec = (isForward: boolean, endOverride?: number): Promise<void> => {
    return new Promise(resolve => {
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
          resolve()
        }
      })
    })
  }

  const flip = () => flipExec(true)
  const backward = () => flipExec(false)
  const flipFromCurrentPercent = (isForward: boolean, distPercent: number) => {
    return flipExec(isForward, distPercent)
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
