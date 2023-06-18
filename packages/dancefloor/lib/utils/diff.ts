import { isNumber } from '@lancercomet/utils/types'

/**
 * Check whether v1 and v2 are different.
 *
 * @param v1
 * @param v2
 * @returns {boolean} true for the different, false for the same.
 */
const diff = <T>(v1: T, v2: T): boolean => {
  if (isNumber(v1) && isNumber(v2)) {
    return v1 - v2 > Number.EPSILON
  }

  return v1 !== v2
}

export {
  diff
}
