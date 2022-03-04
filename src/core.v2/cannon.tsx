import {
  Body, Box, NaiveBroadphase, Vec3, World, Quaternion
} from 'cannon-es'
import { Clock, Object3D } from 'three'

const useCannon = (params?: {
  clock?: Clock
  gravity?: number[]
  allowSleep?: boolean
}) => {
  const gravity = params?.gravity ?? [0, -9.82, 0]
  const clock = new Clock()
  let delta = 0

  const cannonWorld = new World({
    gravity: new Vec3(...gravity),
    broadphase: new NaiveBroadphase(),
    allowSleep: params?.allowSleep ?? true
  })

  const physicsSyncList: Array<{
    rigidBody: Body
    model: Object3D
  }> = []

  const stepCannonWorld = () => {
    for (const item of physicsSyncList) {
      const { rigidBody, model } = item
      model.position.set(
        rigidBody.position.x,
        rigidBody.position.y,
        rigidBody.position.z
      )
      model.quaternion.set(
        rigidBody.quaternion.x,
        rigidBody.quaternion.y,
        rigidBody.quaternion.z,
        rigidBody.quaternion.w
      )
    }

    delta = clock.getDelta()
    cannonWorld.step(delta)
  }

  const addObject = (param: {
    model: Object3D
    mass?: number
    size?: number[]
    type?: typeof Body.STATIC | typeof Body.DYNAMIC | typeof Body.KINEMATIC
  }): [Body, () => void] => {
    const model = param.model
    const mass = param.mass ?? 1
    const type = param.type ?? Body.DYNAMIC
    const size = param.size ?? [1, 1, 1]

    const rigidBody = new Body({
      mass,
      type,
      position: new Vec3(
        model.position.x,
        model.position.y,
        model.position.z
      ),
      quaternion: new Quaternion(
        model.quaternion.x,
        model.quaternion.y,
        model.quaternion.z,
        model.quaternion.w
      )
    })

    const [x, y, z] = size
    const shape = new Box(new Vec3(x / 2, y / 2, z / 2))
    rigidBody.addShape(
      shape,
      new Vec3(0, y * 0.5, 0)
    )
    cannonWorld.addBody(rigidBody)

    const syncObj = {
      model,
      rigidBody
    }
    physicsSyncList.push(syncObj)

    const destroy = () => {
      const index = physicsSyncList.indexOf(syncObj)
      if (index > -1) {
        physicsSyncList.splice(index, 1)
      }
      rigidBody.removeShape(shape)
      cannonWorld.removeBody(rigidBody)
    }

    return [
      rigidBody,
      destroy
    ]
  }

  return {
    addObject,
    cannonWorld,
    stepCannonWorld
  }
}

export {
  useCannon
}
