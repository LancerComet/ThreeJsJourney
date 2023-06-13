import {
  Group,
  AxesHelper,
  AmbientLight,
  PointLight,
  useScene,
  SvgMesh,
  OrthographicCamera, OrbitControls
} from '@lancercomet/dancefloor'
import * as THREE from 'three'
import { defineComponent, ref } from 'vue'

import { useResize } from '../../../hooks/resize'
import jsSvg from './assets/js.svg?raw'

const SvgMeshPage = defineComponent({
  name: 'SvgMeshPage',
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
      useShadow: true,
      antialias: true
    })

    useResize(() => {
      cameraViewport.value = getCameraViewport()
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene background={0xffffff}>
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

        <AmbientLight intensity={0.3} color={0xffffff} />
        <PointLight
          castShadow showHelper
          color={0xffffff} intensity={1.2} distance={100}
          position={{ x: 5, y: 10, z: 5 }}
        />
        <AxesHelper />
        <Group scale={{
          x: 0.5, y: 0.5, z: 0.5
        }}>
          <SvgMesh
            svgPath={jsSvg}
            depth={2}
            castShadow receiveShadow
            fillMaterial={new THREE.MeshStandardMaterial({
              color: '#ffaf2b'
            })}
            stokeMaterial={new THREE.LineBasicMaterial({
              color: '#00A5E6', visible: false
            })}
          />
        </Group>
      </Scene>
    )
  }
})

export {
  SvgMeshPage
}
