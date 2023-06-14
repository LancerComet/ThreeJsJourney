interface IVector3 {
  x: number
  y: number
  z: number
}

interface IQuaternion extends IVector3 {
  w: number
}

export {
  IVector3,
  IQuaternion
}
