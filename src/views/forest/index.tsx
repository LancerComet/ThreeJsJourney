import { Body } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import { Color, Group } from 'three'
import { defineComponent, onBeforeUnmount } from 'vue'
import { useCannon } from '../../core.v2/cannon'
import { useAxesHelper } from '../../core.v2/helpers'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { ObjModel } from '../../core.v2/model.obj'
import { useScene } from '../../core.v2/scene'
import { getObjectSize } from '../../core.v2/utils/objects'

const ForestScene = defineComponent({
  name: 'ForestScene',

  setup () {
    const { Scene, onTick, clock, scene } = useScene({
      useShadow: true,
      useControl: true
    })
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    const { addObject, stepCannonWorld, cannonWorld } = useCannon({
      clock
    })
    const { AxesHelper } = useAxesHelper()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cannonDebugger = new CannonDebugger(scene, cannonWorld)

    onTick(() => {
      stepCannonWorld()
      cannonDebugger.update()
    })

    const Bomb = () => {
      let removeObj: () => void
      const onObjLoad = (model: Group) => {
        removeObj?.()
        const { x, y, z } = getObjectSize(model)
        removeObj = addObject({
          model,
          size: [x, y, z]
        })
        onBeforeUnmount(() => {
          removeObj()
        })
      }

      return (
        <ObjModel
          objUrl='/forest/bomb/Bomb.obj' mtlUrl='/forest/bomb/Bomb.mtl'
          position={{ x: 3, y: 3, z: 0 }}
          scale={{ x: 0.02, y: 0.02, z: 0.02 }}
          castShadow onLoad={onObjLoad}
        />
      )
    }

    const Ground = () => {
      let removeObj: () => void

      const onObjLoad = (model: Group) => {
        removeObj?.()
        const { x, y, z } = getObjectSize(model)
        removeObj = addObject({
          model,
          mass: 1,
          type: Body.KINEMATIC,
          size: [x, y, z]
        })
        onBeforeUnmount(() => {
          removeObj()
        })
      }

      return (
        <ObjModel
          objUrl='/forest/ground/Ground.obj' mtlUrl='/forest/ground/Ground.mtl'
          position={{ x: 0, y: -2, z: 0 }} receiveShadow
          onLoad={onObjLoad}
        />
      )
    }

    const Deer = () => {
      let removeObj: () => void

      const onObjLoad = (model: Group) => {
        removeObj?.()
        const { x, y, z } = getObjectSize(model)
        removeObj = addObject({
          model,
          size: [x, y, z]
        })
        onBeforeUnmount(() => {
          removeObj()
        })
      }

      return (
        <ObjModel
          objUrl='/forest/deer/Deer.obj' mtlUrl='/forest/deer/Deer.mtl'
          position={{ x: 3, y: 0, z: 3 }}
          scale={{ x: 0.1, y: 0.1, z: 0.1 }}
          castShadow receiveShadow
          onLoad={onObjLoad}
        />
      )
    }

    return () => (
      <Scene background={new Color(0xcccccc)}>
        <AmbientLight
          intensity={0.8} color={0xA9C9E2}
        />
        <PointLight
          castShadow intensity={0.9} color={0xfff0ba} distance={50}
          position={{ x: 3, y: 10, z: 3 }} showHelper
        />
        <Ground />
        <Bomb />
        <ObjModel
          objUrl='/forest/tree/Tree.obj' mtlUrl='/forest/tree/Tree.mtl'
          scale={{ x: 0.1, y: 0.1, z: 0.1 }}
          castShadow receiveShadow
        />
        <Deer />
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  ForestScene
}
