import { isNumber } from '@lancercomet/utils/types'
import { Bend, ModifierStack } from 'three.modifiers'
import { defineComponent, inject, onBeforeUnmount, PropType, provide, watchEffect } from 'vue'
import { injectMesh } from '../../dancefloor/lib'

const MODIFIER_SLACK_INJECT_KEY = 'MeshModifier:ModifierSlack'

const MeshModifierSlack = defineComponent({
  name: 'MeshModifierSlack',

  setup (props, { slots }) {
    const mesh = injectMesh()

    if (!mesh) {
      console.error('No mesh was got, Modifier will not be created.')
      return
    }

    const modifierSlack = new ModifierStack(mesh)
    provide(MODIFIER_SLACK_INJECT_KEY, modifierSlack)

    onBeforeUnmount(() => {
      modifierSlack?.destroy()
    })

    return () => (
      <div class='mesh-modifier-slack'>{ slots.default?.() }</div>
    )
  }
})

const injectModifierSlack = () => inject<ModifierStack | undefined>(MODIFIER_SLACK_INJECT_KEY, () => {
  console.warn('You should call this under <MeshModifier />.')
  return undefined
}, true)

const BendModifier = defineComponent({
  name: 'BendModifier',

  props: {
    offset: {
      type: Number as PropType<number>,
      default: 0.5
    },
    angel: {
      type: Number as PropType<number>,
      default: 0
    },
    force: {
      type: Number as PropType<number>,
      default: 0
    }
  },

  setup (props) {
    const bend = new Bend(props.force, props.offset, props.angel)

    const modifierSlack = injectModifierSlack()
    if (modifierSlack) {
      modifierSlack.addModifier(bend)
    }

    const setProps = (): boolean => {
      let isUpdated: boolean = false
      if (isNumber(props.offset) && bend.offset !== props.offset) {
        bend.offset = props.offset
        isUpdated = true
      }
      if (isNumber(props.angel) && bend.angle !== props.angel) {
        bend.angle = props.angel
        isUpdated = true
      }

      if (isNumber(props.force) && bend.force !== props.force) {
        bend.force = props.force
        isUpdated = true
      }
      return isUpdated
    }

    const revokeWatch = watchEffect(() => {
      if (setProps()) {
        modifierSlack?.apply()
      }
    })

    onBeforeUnmount(() => {
      revokeWatch()
      bend.destroy()
    })

    return () => (
      <div class='bend-modifier' />
    )
  }
})

export {
  MeshModifierSlack,
  BendModifier
}
