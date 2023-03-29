import { Box3, Mesh, Object3D, Vector3 } from 'three'

const getObjectSize = (obj: Object3D): Vector3 => {
  const box = new Box3().setFromObject(obj)
  const result = new Vector3()
  box.getSize(result)
  return result
}

const setObjectShadow = (obj: Object3D, castShadow: boolean, receiveShadow: boolean) => {
  obj.traverse((child: Object3D) => {
    if (child instanceof Mesh) {
      child.castShadow = castShadow
      child.receiveShadow = receiveShadow
    }
  })
}

export {
  getObjectSize,
  setObjectShadow
}
