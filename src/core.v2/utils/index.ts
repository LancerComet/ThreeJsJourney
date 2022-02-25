import { Mesh, Object3D } from 'three'

function isNumber (target: unknown): target is number {
  return typeof target === 'number'
}

function setObjectShadow (obj: Object3D, castShadow: boolean, receiveShadow: boolean) {
  obj.traverse(child => {
    if (child instanceof Mesh) {
      child.castShadow = castShadow
      child.receiveShadow = receiveShadow
    }
  })
}

export {
  isNumber,
  setObjectShadow
}
