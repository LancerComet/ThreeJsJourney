import * as Cannon from 'cannon-es'
import { Clock, Mesh, MeshStandardMaterial, PlaneGeometry, SphereGeometry, Vector3 } from 'three'
import { defineComponent } from 'vue'

import { useAxesHelper } from '../../core.v2/helpers'
import { useAmbientLight, usePointLight } from '../../core.v2/lights'
import { useScene } from '../../core.v2/scene'

const Physics = defineComponent({
  name: 'Physics',
  setup () {
    const { Scene, onTick, scene } = useScene()
    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()
    const { AxesHelper } = useAxesHelper()

    const sphereRadius = 0.5
    const sphere = new Mesh(
      new SphereGeometry(sphereRadius),
      new MeshStandardMaterial()
    )
    scene.add(sphere)

    const plane = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshStandardMaterial()
    )
    plane.rotation.x = (-90 / 180) * Math.PI
    scene.add(plane)

    const world = new Cannon.World({
      allowSleep: true,
      gravity: new Cannon.Vec3(0, -9.82, 0)
    })

    const plasticMaterial = new Cannon.Material('plastic')
    const sphereRigidBody = new Cannon.Body({
      mass: 1,
      position: new Cannon.Vec3(0, 3, 0),
      shape: new Cannon.Sphere(sphereRadius),
      material: plasticMaterial
    })
    world.addBody(sphereRigidBody)

    const concreteMaterial = new Cannon.Material('concrete')
    const planeRigidBody = new Cannon.Body({
      mass: 0,
      position: new Cannon.Vec3(0, 0, 0),
      shape: new Cannon.Plane(),
      material: concreteMaterial
    })
    planeRigidBody.quaternion.setFromAxisAngle(new Cannon.Vec3(-1, 0, 0), Math.PI * 0.5)
    world.addBody(planeRigidBody)

    const concretePlasticContactMaterial = new Cannon.ContactMaterial(
      concreteMaterial,
      plasticMaterial,
      {
        friction: 0.1,
        restitution: 0.7
      }
    )
    world.addContactMaterial(concretePlasticContactMaterial)

    const clock = new Clock()
    let delta = 0
    onTick(() => {
      sphere.position.x = sphereRigidBody.position.x
      sphere.position.y = sphereRigidBody.position.y
      sphere.position.z = sphereRigidBody.position.z

      plane.position.x = planeRigidBody.position.x
      plane.position.y = planeRigidBody.position.y
      plane.position.z = planeRigidBody.position.z

      const newDelta = clock.getDelta()
      world.step(newDelta)
      delta = newDelta
    })

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
  Physics
}
