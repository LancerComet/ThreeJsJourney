import { Mesh, Object3D } from 'three'

function setObjectShadow (obj: Object3D, castShadow: boolean, receiveShadow: boolean) {
  obj.traverse(child => {
    if (child instanceof Mesh) {
      child.castShadow = castShadow
      child.receiveShadow = receiveShadow
    }
  })
}

export {
  setObjectShadow
}
