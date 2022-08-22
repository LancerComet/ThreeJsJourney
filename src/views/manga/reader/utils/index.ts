const clampNumber = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max)
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export {
  clampNumber,
  sleep
}
