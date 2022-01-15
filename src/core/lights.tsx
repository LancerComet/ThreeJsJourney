import { AmbientLight, DirectionalLight, PointLight } from 'three'
import { Object3DPosition } from '../types'
import { useThreeObject } from './three-object'

interface ILightBaseConfig {
  color: number
  intensity: number
  castShadow?: boolean
  position?: Object3DPosition
  shadowConfig?: {
    mapSize?: [number, number]
  }
}

const useAmbientLight = (param: {
  color: number
  intensity: number
}) => {
  const ambientLight = new AmbientLight(param.color, param.intensity)
  return {
    AmbientLight: useThreeObject({
      threeObject: ambientLight
    })
  }
}

interface IUsePointLight extends ILightBaseConfig {
  distance: number
  decay: number
}

const usePointLight = (param: IUsePointLight) => {
  const pointLight = new PointLight(param.color, param.intensity, param.distance, param.decay)
  return {
    PointLight: useThreeObject({
      threeObject: pointLight,
      castShadow: param.castShadow,
      position: param.position
    })
  }
}

type IUseDirectionalLight = ILightBaseConfig

const useDirectionalLight = (param: IUseDirectionalLight) => {
  const directionalLight = new DirectionalLight(param.color, param.intensity)
  if (param.shadowConfig?.mapSize) {
    directionalLight.shadow.mapSize.width = param.shadowConfig.mapSize[0]
    directionalLight.shadow.mapSize.height = param.shadowConfig.mapSize[1]
  }

  return {
    DirectionalLight: useThreeObject({
      threeObject: directionalLight,
      castShadow: param.castShadow,
      position: param.position
    })
  }
}

export {
  useAmbientLight,
  usePointLight,
  useDirectionalLight
}
