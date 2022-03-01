import { OrthographicCamera, Vector3 } from 'three'
import { defineComponent } from 'vue'
import { usePlaneGeometry } from '../../../core.v2/geometries'
import { useAxesHelper } from '../../../core.v2/helpers'
import { useAmbientLight } from '../../../core.v2/lights'
import { useStandardMaterial } from '../../../core.v2/materials'
import { useMesh } from '../../../core.v2/mesh'
import { useScene } from '../../../core.v2/scene'
import { HomeHub } from './components/home-hub'

const MangaHub = defineComponent({
  name: 'MangaHub',
  setup () {
    const viewSize = 15
    const aspectRatio = window.innerWidth / window.innerHeight
    const camera = new OrthographicCamera(
      -aspectRatio * viewSize / 2,
      aspectRatio * viewSize / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1, 1000
    )
    camera.position.set(-30, 100, 100)
    camera.lookAt(new Vector3(0, 0, 0))

    const setCameraSize = () => {
      const aspect = window.innerWidth / window.innerHeight
      camera.left = -aspect * viewSize / 2
      camera.right = aspect * viewSize / 2
      camera.top = viewSize / 2
      camera.bottom = -viewSize / 2
      camera.near = 0.1
      camera.far = 1000
    }

    const { Scene, controls } = useScene({
      antialias: true,
      useControl: true,
      useShadow: true,
      camera,
      onResize: () => {
        setCameraSize()
      }
    })

    // controls.enableZoom = false
    // controls.enablePan = process.env.NODE_ENV === 'development'
    // controls.enableRotate = process.env.NODE_ENV === 'development'

    const { AxesHelper } = useAxesHelper()
    const { AmbientLight } = useAmbientLight()
    const { PlaneGeometry } = usePlaneGeometry()
    const { Mesh } = useMesh()
    const { StandardMaterial } = useStandardMaterial()

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
        <AxesHelper />
        <AmbientLight intensity={0.7} color={0xeeeeee} />
        <Ground />
        <HomeHub />
      </Scene>
    )
  }
})

export {
  MangaHub
}
