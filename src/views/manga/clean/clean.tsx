// eslint-disable-next-line import/no-named-as-default
import gsap from 'gsap'
import {
  Color,
  DoubleSide, Group,
  Mesh, MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry, TextureLoader,
  Vector3
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineComponent, onMounted, ref } from 'vue'

import { useAmbientLight, usePointLight } from '../../../core.v2/lights'
import { useScene } from '../../../core.v2/scene'

import style from './clean.module.styl'

const CleanScene = defineComponent({
  name: 'CleanScene',
  setup () {
    const isCameraMoving = ref(false)

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 0.45)
    camera.lookAt(new Vector3(0, 0, 0))

    const { Scene, scene, renderer, onTick } = useScene({
      useControl: false,
      camera
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const { AmbientLight } = useAmbientLight()
    const { PointLight } = usePointLight()

    const scene1Group = new Group()
    const scene2Group = new Group()

    const createScene1 = () => {
      const character = new Mesh(
        new PlaneGeometry(0.35, 0.5),
        new MeshStandardMaterial({
          transparent: true,
          alphaTest: 0.1,
          map: new TextureLoader().load('/manga/clean/character.png'),
          side: DoubleSide
        })
      )
      character.position.set(0, 0, 0.1)
      character.castShadow = true
      character.receiveShadow = true

      const washingMachine = new Mesh(
        new PlaneGeometry(0.5, 0.5),
        new MeshStandardMaterial({
          transparent: true,
          alphaTest: 0.1,
          map: new TextureLoader().load('/manga/clean/washing-machine.png'),
          side: DoubleSide
        })
      )
      washingMachine.castShadow = true
      washingMachine.receiveShadow = true
      washingMachine.position.set(0.3, -0.06, 0)

      scene1Group.position.set(-0.15, 0, 0)

      scene1Group.add(character)
      scene1Group.add(washingMachine)
      scene.add(scene1Group)
    }

    const createScene2 = () => {
      const house = new Mesh(
        new PlaneGeometry(3, 2),
        new MeshStandardMaterial({
          transparent: true,
          alphaTest: 0.1,
          map: new TextureLoader().load('/manga/clean/house.png'),
          side: DoubleSide
        })
      )
      house.receiveShadow = true

      const tree = new Mesh(
        new PlaneGeometry(2, 2),
        new MeshStandardMaterial({
          transparent: true,
          alphaTest: 0.01,
          map: new TextureLoader().load('/manga/clean/tree.png'),
          side: DoubleSide
        })
      )
      tree.castShadow = true
      tree.position.set(1.3, 0.22, 0.2)

      const ground = new Mesh(
        new PlaneGeometry(3, 1),
        new MeshPhongMaterial({
          transparent: true,
          alphaTest: 0.1,
          map: new TextureLoader().load('/manga/clean/ground.png'),
          side: DoubleSide
        })
      )
      ground.rotation.x = (-90 / 180) * Math.PI
      ground.position.set(0, -0.8, 0.8)

      const kinme = new Mesh(
        new PlaneGeometry(1 * 0.3, 2.8 * 0.3),
        new MeshPhongMaterial({
          transparent: true,
          alphaTest: 0.1,
          map: new TextureLoader().load('/manga/clean/kinme.png'),
          side: DoubleSide
        })
      )
      kinme.castShadow = true
      kinme.position.set(-0.5, -0.4, 0.5)
      kinme.rotation.y = (-15 / 180) * Math.PI

      scene2Group.position.set(0, 0.4, 3)
      scene2Group.add(house)
      scene2Group.add(tree)
      scene2Group.add(ground)
      scene2Group.add(kinme)
      scene.add(scene2Group)

      // onTick(() => {
      //   kinme.quaternion.copy(camera.quaternion)
      // })
    }

    onTick(() => {
      controls.update()
    })

    onMounted(() => {
      createScene1()
      createScene2()
      goScene2()
    })

    const goScene1 = async () => {
      controls.enabled = false
      controls.target.set(0, 0, 0)
      isCameraMoving.value = true
      scene1Group.visible = true

      await gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: 0.45,
        ease: 'power3.out'
      })

      await gsap.to(camera.position, {
        duration: 1.5,
        x: 0.05,
        ease: 'power3.out'
      })

      controls.enabled = true
      isCameraMoving.value = false
      scene2Group.visible = false
    }

    const goScene2 = async () => {
      controls.enabled = false
      isCameraMoving.value = true
      scene2Group.visible = true

      await gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: 4.7,
        ease: 'power3.out'
      })

      controls.target.set(0, 0, 3)

      await gsap.to(camera.position, {
        duration: 1.5,
        x: -0.5,
        y: -0.1,
        ease: 'power3.out'
      })

      controls.enabled = true
      isCameraMoving.value = false
      scene1Group.visible = false
    }

    return () => (
      <div>
        <Scene background={0xffffff}>
          <AmbientLight intensity={1}/>
          <PointLight showHelper position={{ x: 4, y: 3, z: 4 }} intensity={0} castShadow/>
        </Scene>

        <div class={style.buttonContainer}>
          <button onClick={goScene1} disabled={isCameraMoving.value}>Scene 1</button>
          <button onClick={goScene2} disabled={isCameraMoving.value}>Scene 2</button>
        </div>
      </div>
    )
  }
})

export {
  CleanScene
}
