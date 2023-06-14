import { isNumber } from '@lancercomet/utils/types'
import { IQuaternion, IVector3 } from '../types'

const updateVector3 = (payload: Partial<IVector3>, target: Partial<IVector3>) => {
  if (!payload || !target) {
    return
  }

  const keys = ['x', 'y', 'z'] as Array<keyof IVector3>
  keys.forEach(key => {
    const newVal = payload[key]
    const oldVal = target[key]
    if (newVal !== oldVal && isNumber(newVal) && isNumber(oldVal)) {
      target[key] = newVal
    }
  })
}

const updateQuaternion = (payload: Partial<IQuaternion>, target: Partial<IQuaternion>) => {
  if (!payload || !target) {
    return
  }

  const keys = ['x', 'y', 'z', 'w'] as Array<keyof IQuaternion>
  keys.forEach(key => {
    const newVal = payload[key]
    const oldVal = target[key]
    if (newVal !== oldVal && isNumber(newVal) && isNumber(oldVal)) {
      target[key] = newVal
    }
  })
}

export {
  updateVector3,
  updateQuaternion
}
