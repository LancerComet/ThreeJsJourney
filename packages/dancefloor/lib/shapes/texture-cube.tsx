import * as THREE from 'three'
import { defineComponent, onBeforeUnmount, PropType } from 'vue'
import { injectContainer } from '../providers/container'

const TextureCube = defineComponent({
  name: 'TextureCube',

  props: {
    width: {
      type: Number as PropType<number>,
      default: 1
    },
    height: {
      type: Number as PropType<number>,
      default: 1
    },
    depth: {
      type: Number as PropType<number>,
      default: 1
    }
  },

  setup (props) {
    const cubeWidth = props.width
    const cubeHeight = props.height
    const cubeDepth = props.depth

    const vertices = [
      // front
      { pos: [0, 0, cubeDepth], norm: [0, 0, 1], uv: [0, 0] }, // 0
      { pos: [cubeWidth, 0, cubeDepth], norm: [0, 0, 1], uv: [1, 0] }, // 1
      { pos: [0, cubeHeight, cubeDepth], norm: [0, 0, 1], uv: [0, 1] }, // 2
      { pos: [cubeWidth, cubeHeight, cubeDepth], norm: [0, 0, 1], uv: [1, 1] }, // 3
      // right
      { pos: [cubeWidth, 0, cubeDepth], norm: [1, 0, 0], uv: [0, 0] }, // 4
      { pos: [cubeWidth, 0, 0], norm: [1, 0, 0], uv: [1, 0] }, // 5
      { pos: [cubeWidth, cubeHeight, cubeDepth], norm: [1, 0, 0], uv: [0, 1] }, // 6
      { pos: [cubeWidth, cubeHeight, 0], norm: [1, 0, 0], uv: [1, 1] }, // 7
      // back
      { pos: [cubeWidth, 0, 0], norm: [0, 0, -1], uv: [0, 0] }, // 8
      { pos: [0, 0, 0], norm: [0, 0, -1], uv: [1, 0] }, // 9
      { pos: [cubeWidth, cubeHeight, 0], norm: [0, 0, -1], uv: [0, 1] }, // 10
      { pos: [0, cubeHeight, 0], norm: [0, 0, -1], uv: [1, 1] }, // 11
      // left
      { pos: [0, 0, 0], norm: [-1, 0, 0], uv: [0, 0] }, // 12
      { pos: [0, 0, cubeDepth], norm: [-1, 0, 0], uv: [1, 0] }, // 13
      { pos: [0, cubeHeight, 0], norm: [-1, 0, 0], uv: [0, 1] }, // 14
      { pos: [0, cubeHeight, cubeDepth], norm: [-1, 0, 0], uv: [1, 1] }, // 15
      // top
      { pos: [cubeWidth, cubeHeight, 0], norm: [0, 1, 0], uv: [0, 0] }, // 16  #PIN
      { pos: [0, cubeHeight, 0], norm: [0, 1, 0], uv: [1, 0] }, // 17 #PIN
      { pos: [cubeWidth, cubeHeight, cubeDepth], norm: [0, 1, 0], uv: [0, 1] }, // 18 #PIN
      { pos: [0, cubeHeight, cubeDepth], norm: [0, 1, 0], uv: [1, 1] }, // 19 #PIN
      // bottom
      { pos: [cubeWidth, 0, cubeDepth], norm: [0, -1, 0], uv: [0, 0] }, // 20  #PIN
      { pos: [0, 0, cubeDepth], norm: [0, -1, 0], uv: [1, 0] }, // 21  #PIN
      { pos: [cubeWidth, 0, 0], norm: [0, -1, 0], uv: [0, 1] }, // 22  #PIN
      { pos: [0, 0, 0], norm: [0, -1, 0], uv: [1, 1] } // 23 #PIN
    ]
    const positions = []
    const normals = []
    const uvs = []
    for (const vertex of vertices) {
      positions.push(...vertex.pos)
      if (vertex.norm) {
        normals.push(...vertex.norm)
      }
      if (vertex.uv) {
        uvs.push(...vertex.uv)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    )
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), 3)
    )
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    )
    geometry.setIndex([
      0, 1, 2, 2, 1, 3,
      4, 5, 6, 6, 5, 7,
      8, 9, 10, 10, 9, 11,
      12, 13, 14, 14, 13, 15,
      16, 17, 18, 18, 17, 19,
      20, 21, 22, 22, 21, 23
    ])

    geometry.computeVertexNormals()

    geometry.clearGroups()
    geometry.addGroup(0, 6, 0) // Front
    geometry.addGroup(6, 12, 1) // Right
    geometry.addGroup(12, 18, 2) // Back
    geometry.addGroup(18, 24, 3) // Left
    geometry.addGroup(24, 30, 4) // Top
    geometry.addGroup(30, 36, 5) // Bottom

    const texLoader = new THREE.TextureLoader()
    const mat1 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })
    const mat3 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })
    const mat4 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })
    const mat5 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })
    const mat6 = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texLoader.load('') })

    const material = [mat1, mat2, mat3, mat4, mat5, mat6]
    const mesh = new THREE.Mesh(geometry, material)

    const container = injectContainer()
    container?.add(mesh)

    onBeforeUnmount(() => {
      container?.remove(mesh)
    })

    return () => (
      <div class='texture-cube' />
    )
  }
})

export {
  TextureCube
}
