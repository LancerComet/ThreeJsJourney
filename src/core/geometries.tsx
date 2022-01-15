import { BoxGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import { Object3DPosition } from '../types'
import { useThreeObject } from './three-object'

interface IUseGeometry {
  material?: Material
  position?: Object3DPosition
  castShadow?: boolean
  receiveShadow?: boolean
}

interface IUseBoxGeometry extends IUseGeometry {
  width?: number
  height?: number
  depth?: number
}

const useBoxGeometry = (param?: IUseBoxGeometry) => {
  const boxGeometry = new BoxGeometry(param?.width, param?.height, param?.depth)
  return _useGeometry(boxGeometry, param)
}

interface IUsePlaneGeometry extends IUseGeometry {
  width?: number
  height?: number
}

const usePlaneGeometry = (param?: IUsePlaneGeometry) => {
  const planeGeometry = new PlaneGeometry(param?.width, param?.height)
  return _useGeometry(planeGeometry, param)
}

export {
  useBoxGeometry,
  usePlaneGeometry
}

function _useGeometry<T extends BufferGeometry> (geometry: T, param?: IUseGeometry) {
  const material = param?.material ?? new MeshStandardMaterial()
  const mesh = new Mesh(geometry, material)
  return {
    Geometry: useThreeObject({
      threeObject: mesh,
      castShadow: param?.castShadow,
      receiveShadow: param?.receiveShadow,
      position: param?.position
    }),
    geometry,
    mesh: mesh,
    material
  }
}
