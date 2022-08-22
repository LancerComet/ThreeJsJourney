import * as THREE from 'three'
import { Bend, ModifierStack } from 'three.modifiers'
import { ComponentPublicInstance, defineComponent, onBeforeUnmount, PropType } from 'vue'

import { injectContainer } from '../../../../../core.v2/providers/container'
import blankImage from '../../assets/blank.png'
import { CubicBezier } from '../../modules/cubic-bezier'
import { InteractionManager } from '../../modules/interactive'
import { useFlip } from './hooks/flip'
import { usePointerControl } from './hooks/pointer-control'
import { fragmentShader, vertexShader } from './modules/shaders'

const pageWidth = 5
const pageHeight = 7
const pageOffset = 0.008
const cubicBezier = new CubicBezier(0.22, 0.58, 0.12, 0.98)

const BLANK_IMAGE = new Image()
BLANK_IMAGE.src = blankImage
const BLANK_TEXTURE = new THREE.Texture(BLANK_IMAGE)

const MangaPage = defineComponent({
  name: 'MangaPage',

  props: {
    index: {
      type: Number as PropType<number>,
      required: true
    },
    totalPage: {
      type: Number as PropType<number>,
      required: true
    },
    image01: {
      type: String as PropType<string>,
      default: blankImage
    },
    image02: {
      type: String as PropType<string>,
      default: blankImage
    },
    interactionManager: {
      type: Object as PropType<InteractionManager>,
      required: true
    }
  },

  emits: ['manualFlip', 'manualBackward'],

  setup (props, { expose, emit }) {
    const { image01, image02, totalPage, index, interactionManager } = props

    const plane = new THREE.PlaneGeometry(pageWidth, pageHeight, 10, 10)
      .translate(-pageWidth / 2, 0, 0)

    const textureLoader = new THREE.TextureLoader()
    const isLightEnabled = true

    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.lights,
      {
        lightIntensity: {
          type: 'f',
          value: 1.0
        },
        texture1: {
          value: BLANK_TEXTURE
        },
        texture2: {
          value: BLANK_TEXTURE
        },
        isLightEnabled: {
          type: 'b',
          value: isLightEnabled
        }
      }
    ])

    textureLoader.loadAsync(image01).then(item => {
      item.minFilter = THREE.LinearFilter
      uniforms.texture1.value = item
    }).catch(error => {
      console.error('Image01 load failure:', error)
    })

    textureLoader.loadAsync(image02).then(item => {
      item.minFilter = THREE.LinearFilter
      uniforms.texture2.value = item
    }).catch(error => {
      console.error('Image02 load failure:', error)
    })

    const shaderMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      lights: true,
      uniforms,
      fragmentShader,
      vertexShader
    })

    const mesh = new THREE.Mesh(plane, shaderMaterial)
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.position.set(pageWidth / 2, pageHeight / 2, index * -pageOffset)

    const container = injectContainer()
    container?.add(mesh)

    interactionManager.add(mesh)

    const bend = new Bend(0, 0, 0)
    bend.offset = 0.5
    bend.angle = (90 / 180) * Math.PI

    const modifier = new ModifierStack(mesh)
    modifier.addModifier(bend)

    const {
      flip, backward, flipFromCurrentPercent,
      getFlipPercent, setFlipPercent,
      stopper
    } = useFlip({
      mesh,
      bend,
      modifier,
      index,
      totalPage,
      pageOffset,
      cubicBezier,
      emit: (eventName, ...args) => {
        emit(eventName as 'manualFlip' | 'manualBackward', ...args)
      }
    })

    const {
      dispose: disposePointerControl,
      setEnabled: setManualFlipEnable
    } = usePointerControl({
      mesh,
      getFlipPercent,
      setFlipPercent,
      stopFlipping: () => stopper?.(),
      flipFromCurrentPercent
    })

    onBeforeUnmount(() => {
      disposePointerControl()
      mesh.clear()
      mesh.removeFromParent()
    })

    expose({
      flip,
      backward,
      setManualFlipEnable,
      getFlipPercent
    })

    return () => (
      <div class='manga-page' />
    )
  }
})

type MangaPageVM = ComponentPublicInstance<{
  image01: string
  image02: string
}, {
  flip: () => Promise<void>
  backward: () => Promise<void>
  setManualFlipEnable: (isEnabled: boolean) => void
  getFlipPercent: () => number
}>

export {
  MangaPage,
  MangaPageVM
}
