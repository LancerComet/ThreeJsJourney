import { defineComponent } from 'vue'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { ObjModel } from '../../core.v2/model.obj'
import { useScene } from '../../core.v2/scene'

const ForestScene = defineComponent({
  name: 'ForestScene',
  setup () {
    const { Scene } = useScene({
      backgroundColor: 0xcccccc,
      useShadow: true,
      useControl: true
    })

    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()

    return () => (
      <div>
        <Scene>
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
          <ObjModel
            objUrl='/forest/bomb/Bomb.obj' mtlUrl='/forest/bomb/Bomb.mtl'
            position={{ x: 2, y: 0, z: 0 }}
            scale={{ x: 0.02, y: 0.02, z: 0.02 }}
            castShadow
          />
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
