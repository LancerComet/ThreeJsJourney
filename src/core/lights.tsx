import { AmbientLight, CameraHelper, DirectionalLight, PointLight } from 'three'
import { Object3DPosition } from '../types'
import { useThreeObject } from './three-object'

interface ILightBaseConfig {
  color: number
  intensity: number
  castShadow?: boolean
  position?: Object3DPosition
}

const useAmbientLight = (param: {
  color: number
  intensity: number
}) => {
  const ambientLight = new AmbientLight(param.color, param.intensity)
  return {
    AmbientLight: useThreeObject({
      threeObject: ambientLight
    }),
    light: ambientLight
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
    }),
    light: pointLight
  }
}

interface IUseDirectionalLight extends ILightBaseConfig {
  shadowConfig?: {
    mapSize?: [number, number]
    camera?: {
      near: number
      far: number
    }
  }
}

const useDirectionalLight = (param: IUseDirectionalLight) => {
  const directionalLight = new DirectionalLight(param.color, param.intensity)

  if (param.shadowConfig?.mapSize) {
    directionalLight.shadow.mapSize.width = param.shadowConfig.mapSize[0]
    directionalLight.shadow.mapSize.height = param.shadowConfig.mapSize[1]
  }

  if (param.shadowConfig?.camera) {
    directionalLight.shadow.camera.near = param.shadowConfig.camera.near
    directionalLight.shadow.camera.far = param.shadowConfig.camera.far
  }

  return {
    DirectionalLight: useThreeObject({
      threeObject: directionalLight,
      castShadow: param.castShadow,
      position: param.position
    }),
    light: directionalLight
  }
}

export {
  useAmbientLight,
  usePointLight,
  useDirectionalLight
}
