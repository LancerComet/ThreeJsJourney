import { World, Vec3, Quaternion, Body } from 'cannon-es'
import { defineComponent, inject, onBeforeUnmount, onMounted, PropType, provide } from 'vue'

const WORLD_INJECT_KEY = 'cannon:world'
const geCannonWorld = () => inject<World>(WORLD_INJECT_KEY)

const RIGID_BODY_INJECT_KEY = 'cannon:rigidbody'
const getRigidBody = () => inject<Body>(RIGID_BODY_INJECT_KEY)

const CannonWorld = defineComponent({
  name: 'CannonWorld',

  setup () {
    let isTickStart = false
    const world = new World()

    const tick = () => {
      // TODO: ...
    }

    const stopTick = () => {
      isTickStart = false
    }

    provide(WORLD_INJECT_KEY, world)

    onMounted(() => {
      isTickStart = true
      tick()
    })

    onBeforeUnmount(() => {
      stopTick()
    })

    return () => (
      <div class='cannon-world'>Cannon World</div>
    )
  }
})

const CannonRigidBody = defineComponent({
  name: 'CannonRigidBody',

  props: {
    mass: {
      type: Number as PropType<number>,
      default: 0
    },

    type: {
      type: Number as PropType<typeof Body.KINEMATIC |
        typeof Body.DYNAMIC |
        typeof Body.STATIC
      >,
      default: Body.DYNAMIC
    },

    position: {
      type: Array as PropType<number[]>,
      default: () => [0, 0, 0]
    },

    quaternion: {
      type: Array as PropType<number[]>,
      default: () => [0, 0, 0, 0]
    }
  },

  setup (props) {
    const world = geCannonWorld()
    if (!world) {
      throw new Error('CannonRigidbody should be placed under CannonWorld.')
    }

    const rigidBody = new Body({
      mass: props.mass,
      type: props.type,
      position: new Vec3(...props.position),
      quaternion: new Quaternion(...props.quaternion)
    })

    provide(RIGID_BODY_INJECT_KEY, rigidBody)

    return () => (
      <div class='cannon-rigidbody'>Cannon Rigidbody</div>
    )
  }
})

export {
  CannonWorld,
  CannonRigidBody
}
