import { Object3D } from 'three'
import { defineComponent } from 'vue'
import { Object3DPosition } from '../types'

const useThreeObject = (param: {
  threeObject: Object3D
  castShadow?: boolean
  receiveShadow?: boolean
  position?: Object3DPosition
}) => {
  const threeObject = param.threeObject
  threeObject.castShadow = param.castShadow === true
  threeObject.receiveShadow = param.receiveShadow === true

  const position = param?.position
  if (position) {
    threeObject.position.set(position[0], position[1], position[2])
  }

  return defineComponent({
    data: () => ({
      threeObject
    })
  })
}

export {
  useThreeObject
}
