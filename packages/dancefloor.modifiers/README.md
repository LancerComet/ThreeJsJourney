# DanceFloor Modifiers

Use [three.modifiers](https://github.com/drawcall/threejs-mesh-modifiers) with Vue.

## Quick start

```tsx
import { BoxGeometry, BasicMaterial, Mesh, useScene, PerspectiveCamera, OrbitControls } from '@lancercomet/dancefloor'
import { MeshModifierSlack, BendModifier } from '@lancercomet/dancefloor.modifiers'
import { defineComponent } from 'vue'

const MyApp = defineComponent({
  name: 'MyApp',

  setup () {
    const { Scene } = useScene()

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <Mesh>
          <BoxGeometry width={1} height={1} depth={1} />
          <BasicMaterial params={materialParamsRef.value} />
          
          <MeshModifierSlack>
            <BendModifier offset={0.5} angle={90 / 180 * Math.PI} force={0.5} />
          </MeshModifierSlack>
        </Mesh>
      </Scene>
    )
  }
})

export {
  MyApp
}
```
