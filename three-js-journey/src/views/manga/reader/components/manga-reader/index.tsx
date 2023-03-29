import * as THREE from 'three'
import { ComponentPublicInstance, defineComponent, PropType, ref } from 'vue'

import { PlaneGeometry } from '../../../../../../packages/dancefloor/lib/modules/geometries'
import { ShaderMaterial } from '../../../../../../packages/dancefloor/lib/modules/materials'
import { Mesh } from '../../../../../../packages/dancefloor/lib/modules/mesh'
import { BendModifier, BendModifierVM, MeshModifierSlack } from '../../../../../../packages/dancefloor/lib/modules/modifier'
import blankImage from '../../assets/blank.png'
import { CubicBezier } from '../../modules/cubic-bezier'
import { useFlip } from './hooks/flip'
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
    }
  },

  setup (props, { expose }) {
    const { image01, image02, totalPage, index } = props

    const textureLoader = new THREE.TextureLoader()
    const isLightEnabled = true

    const meshPositionRef = ref({
      x: pageWidth / 2,
      y: pageHeight / 2,
      z: index * -pageOffset
    })
    const meshRotationRef = ref({
      x: 0,
      y: 0,
      z: 0
    })
    const bendRef = ref<BendModifierVM>()

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

    const {
      flip, backward, flipFromCurrentPercent,
      getFlipPercent, setFlipPercent,
      stopper
    } = useFlip({
      index,
      totalPage,
      pageOffset,
      cubicBezier,
      setPosition: payload => {
        const keys = Object.keys(payload) as ('x' | 'y' | 'z')[]
        keys.forEach(key => {
          const value = payload[key]
          if (typeof value === 'number') {
            meshPositionRef.value[key] = value
          }
        })
      },
      setRotation: payload => {
        const keys = Object.keys(payload) as ('x' | 'y' | 'z')[]
        keys.forEach(key => {
          const value = payload[key]
          if (typeof value === 'number') {
            meshRotationRef.value[key] = value
          }
        })
      },
      setForce: force => {
        bendRef.value?.setForce(force)
      }
    })

    const stopFlipping = () => {
      stopper?.()
    }

    expose({
      flip,
      backward,
      getFlipPercent,
      setFlipPercent,
      stopFlipping,
      flipFromCurrentPercent
    })

    return () => (
      <Mesh
        receiveShadow castShadow
        position={meshPositionRef.value}
        rotation={meshRotationRef.value}
      >
        <PlaneGeometry
          width={pageWidth} height={pageHeight}
          widthSegment={10} heightSegment={10}
          translate={{
            x: -pageWidth / 2, y: 0, z: 0
          }}
        />
        <ShaderMaterial params={{
          lights: true,
          side: THREE.DoubleSide,
          fragmentShader,
          vertexShader,
          uniforms
        }}/>

        <MeshModifierSlack>
          <BendModifier
            ref={bendRef}
            offset={0.5} angel={(90 / 180) * Math.PI}
          />
        </MeshModifierSlack>
      </Mesh>
    )
  }
})

type MangaPageVM = ComponentPublicInstance<{
  image01: string
  image02: string
}, {
  flip: () => Promise<void>
  backward: () => Promise<void>
  getFlipPercent: () => number
  setFlipPercent: (isForward: boolean, percent: number) => void
  stopFlipping: () => void
  flipFromCurrentPercent: (isForward: boolean, distPercent: number) => Promise<void>
}>

export {
  MangaPage,
  MangaPageVM
}
