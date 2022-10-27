import * as THREE from 'three'
import { defineComponent } from 'vue'

import { Group } from '../../../core.v2/group'
import { AxesHelper } from '../../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../../core.v2/lights'
import { useScene } from '../../../core.v2/scene'
import { SvgMesh } from '../../../core.v2/shapes/svg-mesh'

import { useResize } from '../../../hooks/resize'
import jsSvg from './assets/js.svg?raw'

const createCamera = (): [THREE.OrthographicCamera, () => void] => {
  const viewSize = 8.2
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.OrthographicCamera(
    -aspectRatio * viewSize / 2,
    aspectRatio * viewSize / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1, 1000
  )
  camera.position.set(-40, 60, 180)

  const setCameraSize = () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -aspect * viewSize / 2
    camera.right = aspect * viewSize / 2
    camera.top = viewSize / 2
    camera.bottom = -viewSize / 2
    camera.near = 0.1
    camera.far = 1000
  }

  return [camera, setCameraSize]
}

const SvgMeshPage = defineComponent({
  name: 'SvgMeshPage',
  setup () {
    const [camera, setCameraSize] = createCamera()
    const { Scene } = useScene({
      useControl: true,
      useShadow: true,
      antialias: true,
      camera
    })

    useResize(() => {
      setCameraSize()
    })

    return () => (
      <Scene background={0xffffff}>
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
