let lastLoop = 0
let fps: number = 0

const tick = () => {
  const thisLoop = performance.now()
  fps = Math.floor(1000 / (thisLoop - lastLoop))
  lastLoop = thisLoop
  requestAnimationFrame(tick)
}

tick()

const getFps = () => fps

export {
  getFps
}
