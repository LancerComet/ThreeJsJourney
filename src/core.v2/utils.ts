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

type Obj = { [key: string]: unknown }

function isObject (object: unknown): object is Obj {
  return object != null && typeof object === 'object'
}

function checkObjEqual (obj1?: Obj, obj2?: Obj): boolean {
  if (!obj1 || !obj2) {
    return false
  }

  if (obj1 === obj2) {
    return true
  }

  const props1 = Object.getOwnPropertyNames(obj1)
  const props2 = Object.getOwnPropertyNames(obj2)

  if (props1.length !== props2.length) {
    return false
  }

  for (let i = 0; i < props1.length; i++) {
    const val1 = obj1[props1[i]]
    const val2 = obj2[props1[i]]
    const isObjects = isObject(val1) && isObject(val2)

    if ((isObjects && !checkObjEqual(val1, val2)) || (!isObjects && val1 !== val2)) {
      return false
    }
  }
  return true
}

export {
  isNumber,
  setObjectShadow,
  checkObjEqual
}
