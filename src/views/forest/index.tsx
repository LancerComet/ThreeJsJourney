import { Vec3, World, Body, NaiveBroadphase, Box } from 'cannon-es'
import { Color, Group, Object3D } from 'three'
import { defineComponent } from 'vue'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { ObjModel } from '../../core.v2/model.obj'
import { useScene } from '../../core.v2/scene'
import { getObjectSize } from '../../core.v2/utils/objects'

const ForestScene = defineComponent({
  name: 'ForestScene',
  setup () {
    const { Scene, onTick, clock } = useScene({
      useShadow: true,
      useControl: true
    })
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    let delta = 0

    const physicsSyncList: Array<{
      rigidBody: Body
      model: Object3D
    }> = []

    const cannonWorld = new World({
      gravity: new Vec3(0, -9.82, 0),
      broadphase: new NaiveBroadphase(),
      allowSleep: true
    })

    const tickPhysics = () => {
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
        cannonWorld.step(delta)
        delta = clock.getDelta()
      }
    }

    onTick(() => {
      tickPhysics()
    })

    const Bomb = () => {
      const rigidBody = new Body({
        mass: 5,
        type: Body.DYNAMIC,
        position: new Vec3(0, 3, 0)
      })

      const onObjLoad = (model: Group) => {
        const { x, y, z } = getObjectSize(model)
        rigidBody.addShape(
          new Box(new Vec3(x / 2, y / 2, z / 2)),
          new Vec3(0, y * 0.5, 0)
        )
        cannonWorld.addBody(rigidBody)
        physicsSyncList.push({
          model,
          rigidBody
        })
      }

      return (
        <ObjModel
          objUrl='/forest/bomb/Bomb.obj' mtlUrl='/forest/bomb/Bomb.mtl'
          position={{ x: 2, y: 0, z: 0 }}
          scale={{ x: 0.02, y: 0.02, z: 0.02 }}
          castShadow onLoad={onObjLoad}
        />
      )
    }

    return () => (
      <div>
        <Scene background={new Color(0xcccccc)}>
          <AmbientLight
            intensity={0.8} color={0xA9C9E2}
          />
          <PointLight
            castShadow intensity={0.9} color={0xfff0ba} distance={50}
            position={{ x: 3, y: 10, z: 3 }} showHelper
          />
          <ObjModel
            objUrl='/forest/ground/Ground.obj' mtlUrl='/forest/ground/Ground.mtl'
            position={{ x: 0, y: -2, z: 0 }} receiveShadow
          />
          <Bomb />
          <ObjModel
            objUrl='/forest/tree/Tree.obj' mtlUrl='/forest/tree/Tree.mtl'
            scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            castShadow receiveShadow
          />
          <ObjModel
            objUrl='/forest/deer/Deer.obj' mtlUrl='/forest/deer/Deer.mtl'
            position={{ x: 3, y: 0, z: 3 }}
            scale={{ x: 0.1, y: 0.1, z: 0.1 }}
            castShadow receiveShadow
          />
        </Scene>
      </div>
    )
  }
})

export {
  ForestScene
}
