import * as THREE from 'three'
import { Bend, ModifierStack } from 'three.modifiers'
import { ComponentPublicInstance, defineComponent, onBeforeUnmount, PropType, ref } from 'vue'

import { injectContainer } from '../../core.v2/providers/container'
import { CubicBezier } from './cubic-bezier'

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D fronttex;
uniform sampler2D backtex;

void main() {
  vec3 color;
  if (gl_FrontFacing) {
    color = texture2D(fronttex, vUv).rgb;
  } else {
    vec2 backUv = vec2 (1.0 - vUv.s, vUv.t);
    color = texture2D(backtex, backUv).rgb;
  }
  gl_FragColor = vec4(color, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}
`

const pageWidth = 5
const pageHeight = 7
const bezierFlip = new CubicBezier(0.22, 0.58, 0.12, 0.98)
const bezierBack = new CubicBezier(0.43, 0.68, 0.45, 0.8)

const MangaPage = defineComponent({
  name: 'MangaPage',

  props: {
    index: {
      type: Number as PropType<number>,
      required: true
    },
    image01: {
      type: String as PropType<string>,
      required: true
    },
    image02: {
      type: String as PropType<string>,
      required: true
    }
  },

  setup (props, { expose }) {
    const { image01, image02 } = props

    const plane = new THREE.PlaneGeometry(pageWidth, pageHeight, 10, 10)
      .translate(-pageWidth / 2, 0, 0)

    const shaderMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        fronttex: {
          value: new THREE.TextureLoader().load(image01)
        },
        backtex: {
          value: new THREE.TextureLoader().load(image02)
        }
      },
      vertexShader,
      fragmentShader
    })

    const mesh = new THREE.Mesh(plane, shaderMaterial)
    mesh.position.set(pageWidth / 2, pageHeight / 2, props.index * -0.001)

    const modifier = new ModifierStack(mesh)

    const bend = new Bend(0, 0, 0)
    bend.offset = 0.5
    bend.angle = (90 / 180) * Math.PI

    modifier.addModifier(bend)

    const container = injectContainer()
    container?.add(mesh)

    onBeforeUnmount(() => {
      mesh.clear()
      mesh.removeFromParent()
    })

    const flip = () => {
      return new Promise<void>(resolve => {
        bezierFlip.tick(0, 1, 60, (percent, isDone) => {
          bend.force = Math.max(Math.sin(percent * 3), 0)
          modifier.apply()
          mesh.rotation.y = Math.min(percent, 1) * Math.PI
          if (isDone) {
            resolve()
          }
        })
      })
    }

    const backward = () => {
      return new Promise<void>(resolve => {
        bezierBack.tick(1, 0, 60, (percent, isDone) => {
          bend.force = Math.max(Math.sin(percent * 3), 0)
          modifier.apply()
          mesh.rotation.y = Math.min(percent, 1) * Math.PI
          if (isDone) {
            resolve()
          }
        })
      })
    }

    expose({
      flip,
      backward
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
}>

export {
  MangaPage,
  MangaPageVM
}
