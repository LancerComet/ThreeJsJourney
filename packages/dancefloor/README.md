# DanceFloor

This is a Vue binding for ThreeJS, just like a Vue version of ReactThreeFiber.

## Quick start

```tsx
import { BoxGeometry, BasicMaterial, Mesh, useScene, PerspectiveCamera, OrbitControls } from '@lancercomet/dancefloor'
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
        </Mesh>
      </Scene>
    )
  }
})

export {
  MyApp
}
```
