import {
  AxesHelper, AmbientLight, PointLight,
  RayCaster, RayCasterComponent,
  useScene, PerspectiveCamera, OrbitControls
} from '@lancercomet/dancefloor'
import { Clock, Intersection, Mesh, MeshStandardMaterial, Object3D, SphereGeometry, Vector3 } from 'three'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const RayCasterPage = defineComponent({
  name: 'RayCasterPage',
  setup () {
    const { Scene, scene } = useScene()

    const createSphere = (x: number = 0, y = 0, z = 0) => {
      const mesh = new Mesh(
        new SphereGeometry(),
        new MeshStandardMaterial()
      )
      mesh.position.x = x
      mesh.position.y = y
      mesh.position.z = z
      return mesh
    }

    const sphere1 = createSphere(-3)
    const sphere2 = createSphere(0)
    const sphere3 = createSphere(3, 5)
    scene.add(sphere1, sphere2, sphere3)

    const clock = new Clock()
    let isTickOn = true

    const rayCasterRef = ref<RayCasterComponent>()
    const rayOrigin = new Vector3(-6, 0, 0)
    const rayDirection = new Vector3(1, 0, 0)
    rayDirection.normalize()

    const check = () => {
      const elapsedTime = clock.getElapsedTime()
      sphere1.position.y = Math.sin(elapsedTime * 0.5) * 3
      sphere2.position.y = Math.sin(elapsedTime * 1) * 3
      sphere3.position.y = Math.sin(elapsedTime * 1.5) * 3

      const objs = [sphere1, sphere2, sphere3]

      // Paint spheres blue at first.
      objs.forEach(item => {
        item.material.color.set(0x0000ff)
      })

      const rayCaster = rayCasterRef.value?.getRayCaster()
      if (!rayCaster) {
        console.warn('No RayCaster was got.')
        return
      }

      const intersections = rayCaster.intersectObjects(objs)

      // Paint intersected sphere red.
      intersections.forEach((item: Intersection<Object3D>) => {
        ((item.object as Mesh).material as MeshStandardMaterial).color.set(0xff0000)
      })

      isTickOn && requestAnimationFrame(check)
    }

    const stopCheck = () => {
      isTickOn = false
    }

    onMounted(() => {
      check()
    })

    onBeforeUnmount(() => {
      stopCheck()
    })

    return () => (
      <Scene>
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
           <OrbitControls />
        </PerspectiveCamera>

        <AmbientLight />
        <PointLight position={{ x: 5, y: 5, z: 5 }} castShadow />
        <AxesHelper />
        <RayCaster ref={rayCasterRef} origin={rayOrigin} direction={rayDirection} />
      </Scene>
    )
  }
})

export {
  RayCasterPage
}
