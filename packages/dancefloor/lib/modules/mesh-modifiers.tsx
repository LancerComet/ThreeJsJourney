import { Bend, ModifierStack } from 'three.modifiers'
import { ComponentPublicInstance, defineComponent, inject, onBeforeUnmount, PropType, provide } from 'vue'
import { injectMesh } from '../providers/mesh'

const getModifierSlackInjectKey = 'three:meshModifier:getModifierSlack'

const MeshModifierSlack = defineComponent({
  name: 'MeshModifierSlack',

  setup (props, { slots }) {
    const mesh = injectMesh()
    let modifierSlack: ModifierStack
    if (mesh) {
      modifierSlack = new ModifierStack(mesh)
    }

    const getModifierSlack = () => {
      return modifierSlack
    }
    provide(getModifierSlackInjectKey, getModifierSlack)

    onBeforeUnmount(() => {
      modifierSlack?.destroy()
    })

    return () => (
      <div class='mesh-modifier'>{ slots.default?.() }</div>
    )
  }
})

const injectGetModifierSlack = () => inject<() => ModifierStack | undefined>(getModifierSlackInjectKey, () => {
  console.warn('You should call this under <MeshModifier />.')
  return undefined
})

const BendModifier = defineComponent({
  name: 'BendModifier',

  props: {
    f: {
      type: Number as PropType<number>,
      default: 0
    },
    o: {
      type: Number as PropType<number>,
      default: 0
    },
    a: {
      type: Number as PropType<number>,
      default: 0
    },
    offset: {
      type: Number as PropType<number>
    },
    angel: {
      type: Number as PropType<number>
    }
  },

  setup (props, { expose }) {
    const bend = new Bend(props.f, props.o, props.a)
    if (typeof props.offset === 'number') {
      bend.offset = props.offset
    }
    if (typeof props.angel === 'number') {
      bend.angle = props.angel
    }

    const getModifier = injectGetModifierSlack()
    const modifier = getModifier()
    if (modifier) {
      modifier.addModifier(bend)
    }

    const setForce = (force: number) => {
      bend.force = force
      modifier?.apply()
    }

    expose({
      setForce
    })

    onBeforeUnmount(() => {
      bend.destroy()
    })

    return () => (
      <div class='bend-modifier' />
    )
  }
})

type BendModifierVM = ComponentPublicInstance<{
  f: number
  o: number
  a: number
  offset: number
  angel: number
}, {
  setForce: (force: number) => void
}>

export {
  MeshModifierSlack,
  BendModifier,
  BendModifierVM
}
