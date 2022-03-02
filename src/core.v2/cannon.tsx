import { World, Vec3, Quaternion, Body, Box, NaiveBroadphase } from 'cannon-es'
import { Clock } from 'three'
import { defineComponent, inject, onBeforeUnmount, onMounted, PropType, provide, watch } from 'vue'

const WORLD_INJECT_KEY = 'cannon:world'
const geCannonWorld = () => inject<World | undefined>(WORLD_INJECT_KEY, () => {
  console.warn('geCannonWorld can only be called when this component is placed under CannonWorld.')
  return undefined
}, true)

let worldId = 0

const useCannonWorld = () => {
  const world = new World({
    broadphase: new NaiveBroadphase()
  })

  const CannonWorld = defineComponent({
    name: 'CannonWorld',

    props: {
      gravity: {
        type: Array as PropType<number[]>,
        default: () => [0, -9.82, 0]
      },

      allowSleep: {
        type: Boolean as PropType<boolean>,
        default: true
      }
    },

    setup (props, ctx) {
      let isTickStart = false
      const clock = new Clock()
      let delta = 0

      const setProps = () => {
        const [gX, gY, gZ] = props.gravity
        const isGravityChanged = gX !== world.gravity.x ||
          gY !== world.gravity.y ||
          gZ !== world.gravity.z
        if (isGravityChanged) {
          world.gravity.set(gX, gY, gZ)
        }

        const isAllowSleepChanged = props.allowSleep !== world.allowSleep
        if (isAllowSleepChanged) {
          world.allowSleep = props.allowSleep
        }
      }

      watch(props, setProps, {
        deep: true,
        immediate: true
      })

      const tick = () => {
        if (!isTickStart) {
          return
        }

        world.step(delta)
        delta = clock.getDelta()

        // TODO: ...
        requestAnimationFrame(tick)
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
        <div class='cannon-world' data-id={worldId++}>{
          ctx.slots.default?.()
        }</div>
      )
    }
  })

  return {
    CannonWorld,
    world
  }
}

const useCannonBox = (param?: {
  position?: number[],
  quaternion?: number[],
  size?: number[]
}) => {
  const position = param?.position ?? [0, 0, 0]
  const quaternion = param?.quaternion ?? [0, 0, 0, 0]

  const rigidBody = new Body({
    position: new Vec3(...position),
    quaternion: new Quaternion(...quaternion)
  })

  const [x, y, z] = param?.size ?? [1, 1, 1]
  const boxShape = new Box(new Vec3(x / 2, y / 2, z / 2))
  const offset = new Vec3(0, 0, 0)
  rigidBody.addShape(boxShape, offset)

  const CannonBox = defineComponent({
    name: 'CannonBox',

    props: {
      mass: {
        type: Number as PropType<number>,
        default: 1
      },

      type: {
        type: Number as PropType<typeof Body.KINEMATIC |
          typeof Body.DYNAMIC |
          typeof Body.STATIC
          >,
        default: Body.DYNAMIC
      }
    },

    setup (props) {
      const cannonWorld = geCannonWorld()
      if (cannonWorld) {
        cannonWorld.addBody(rigidBody)
      }

      watch(props, () => {
        const isMassChanged = rigidBody.mass !== props.mass
        if (isMassChanged) {
          rigidBody.mass = props.mass
        }

        const isTypeChanged = rigidBody.type !== props.type
        if (isTypeChanged) {
          rigidBody.type = props.type
        }
      }, {
        deep: true
      })

      onBeforeUnmount(() => {
        if (cannonWorld) {
          cannonWorld.removeBody(rigidBody)
        }
        rigidBody.removeShape(boxShape)
      })

      return () => (
        <div class='cannon-box' data-rigid-id={rigidBody.id} data-box-id={boxShape.id} />
      )
    }
  })

  return {
    CannonBox,
    rigidBody,
    boxShape
  }
}

export {
  useCannonBox,
  useCannonWorld
}
