import { Clock, Mesh, MeshStandardMaterial, Raycaster, SphereGeometry, Vector3 } from 'three'
import { defineComponent } from 'vue'

import { useAxesHelper } from '../../core.v2/helpers'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { useScene } from '../../core.v2/scene'

const RayCasterPage = defineComponent({
  name: 'RayCasterPage',
  setup () {
    const { Scene, scene } = useScene()
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    const { AxesHelper } = useAxesHelper()

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

    const check = () => {
      const rayCaster = new Raycaster()
      const rayOrigin = new Vector3(-6, 0, 0)
      const rayDirection = new Vector3(1, 0, 0)
      rayDirection.normalize()
      rayCaster.set(rayOrigin, rayDirection)

      const elapsedTime = clock.getElapsedTime()
      sphere1.position.y = Math.sin(elapsedTime * 0.5) * 3
      sphere2.position.y = Math.sin(elapsedTime * 1) * 3
      sphere3.position.y = Math.sin(elapsedTime * 1.5) * 3

      const objs = [sphere1, sphere2, sphere3]

      // Paint spheres blue at first.
      objs.forEach(item => {
        item.material.color.set(0x0000ff)
      })

      const intersections = rayCaster.intersectObjects(objs)

      // Paint intersected sphere red.
      intersections.forEach(item => {
        ((item.object as Mesh).material as MeshStandardMaterial).color.set(0xff0000)
      })

      requestAnimationFrame(check)
    }

    // I don't know why I have to call this function by using RAF.
    // Sync calling is incorrect.
    requestAnimationFrame(check)

    return () => (
      <Scene>
        <AmbientLight />
        <PointLight position={{ x: 5, y: 5, z: 5 }} castShadow />
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  RayCasterPage
}
