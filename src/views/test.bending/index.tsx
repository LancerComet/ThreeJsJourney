import * as THREE from 'three'
import { OrthographicCamera } from 'three'
import { ModifierStack, Bend } from 'three.modifiers'
import { defineComponent } from 'vue'

import { AxesHelper } from '../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../core.v2/lights'
import { useScene } from '../../core.v2/scene'

import image01 from './assets/01.jpg'
import image02 from './assets/02.jpg'

const pageWidth = 5
const pageHeight = 7

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

const createPage = (param: {
  image01: string,
  image02: string,
  bendOffset: number,
  bendAngel: number
}) => {
  const { image01, image02, bendOffset, bendAngel } = param

  const plane = new THREE.PlaneGeometry(pageWidth, pageHeight, 10, 10)
    .translate(-pageWidth, 0, 0)

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
  mesh.position.set(pageWidth / 2, pageHeight / 2, 0)

  const modifier = new ModifierStack(mesh)

  const bend = new Bend(0, 0, 0)
  bend.offset = bendOffset
  bend.angle = bendAngel

  modifier.addModifier(bend)

  return {
    plane,
    mesh,
    modifier,
    bend
  }
}

const createCamera = (): [OrthographicCamera, () => void] => {
  const viewSize = 10
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new OrthographicCamera(
    -aspectRatio * viewSize / 2,
    aspectRatio * viewSize / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1, 1000
  )
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  const setCameraSize = () => {
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -aspect * viewSize / 2
    camera.right = aspect * viewSize / 2
    camera.top = viewSize / 2
    camera.bottom = -viewSize / 2
    camera.near = 0.1
    camera.far = 1000
  }

  return [camera, setCameraSize]
}

const TestBending = defineComponent({
  name: 'TestBending',

  setup () {
    const [camera, setCameraSize] = createCamera()
    const { Scene, onTick, scene } = useScene({
      useControl: true,
      camera,
      onResize: () => {
        setCameraSize()
      }
    })

    const {
      mesh: meshPrimary,
      modifier: modifierPrimary,
      bend: bendPrimary
    } = createPage({
      image01,
      image02,
      bendOffset: 1,
      bendAngel: (90 / 180) * Math.PI
    })

    const container = new THREE.Group()
    container.position.x = pageWidth
    container.add(meshPrimary)
    scene.add(container)

    let rotateAngel = 0

    onTick(() => {
      modifierPrimary.apply()
      container.rotation.y = (rotateAngel / -180) * Math.PI
    })

    window.addEventListener('pointermove', event => {
      const viewportX = window.innerWidth
      const viewportY = window.innerHeight

      const x = event.offsetX
      const percentX = x / (viewportX * 0.8)
      bendPrimary.force = Math.max(Math.sin(percentX * 3), 0)

      rotateAngel = Math.min(percentX, 1) * -180
    })

    return () => (
      <Scene background={0xaaaaaa}>
        <AmbientLight />
        <PointLight castShadow showHelper position={{ x: 0, y: 5, z: 3 }} />
        <AxesHelper />
      </Scene>
    )
  }
})

export {
  TestBending
}
