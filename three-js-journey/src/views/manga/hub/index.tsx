import {
  AxesHelper, useScene,
  AmbientLight,
  Mesh, StandardMaterial, PlaneGeometry,
  OrbitControls, OrthographicCamera
} from '@lancercomet/dancefloor'
import { defineComponent, ref } from 'vue'

import { useResize } from '../../../hooks/resize'
import { HomeHub } from './components/home-hub'

const MangaHub = defineComponent({
  name: 'MangaHub',
  setup () {
    const viewSize = 15
    const getCameraViewport = () => {
      const aspect = window.innerWidth / window.innerHeight
      return {
        left: -aspect * viewSize / 2,
        right: aspect * viewSize / 2,
        top: viewSize / 2,
        bottom: -viewSize / 2
      }
    }
    const cameraViewport = ref(getCameraViewport())
    const { Scene, resize } = useScene({
      antialias: true,
      useShadow: true
    })

    useResize(() => {
      cameraViewport.value = getCameraViewport()
      resize(window.innerWidth, window.innerHeight)
    })

    const Ground = () => {
      return (
        <Mesh rotation={{ x: (-90 / 180) * Math.PI }} receiveShadow>
          <PlaneGeometry width={1000} height={1000} />
          <StandardMaterial params={{
            transparent: true
          }} />
        </Mesh>
      )
    }

    return () => (
      <Scene background={0xdddddd}>
        <OrthographicCamera
          position={{ x: -30, y: 100, z: 100 }}
          lookAt={{ x: 0, y: 0, z: 0 }}
          far={1000}
          left={cameraViewport.value.left}
          right={cameraViewport.value.right}
          top={cameraViewport.value.top}
          bottom={cameraViewport.value.bottom}
        >
          <OrbitControls />
        </OrthographicCamera>

        <AxesHelper />
        <AmbientLight intensity={0.9} color={0xeeeeee} />
        <Ground />
        <HomeHub />
      </Scene>
    )
  }
})

export {
  MangaHub
}
