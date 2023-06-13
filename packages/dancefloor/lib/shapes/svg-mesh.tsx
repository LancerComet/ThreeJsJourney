import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { defineComponent, onBeforeUnmount, PropType } from 'vue'
import { injectContainer } from '../providers/container'

const renderSVG = (param: {
  extrusion: number,
  svgPath: string,
  fillMaterial: THREE.Material,
  stokeMaterial: THREE.Material
  castShadow: boolean
  receiveShadow: boolean
}) => {
  const { extrusion, svgPath, fillMaterial, stokeMaterial, castShadow, receiveShadow } = param
  const loader = new SVGLoader()
  const svgData = loader.parse(svgPath)
  const svgGroup = new THREE.Group()
  const svgShapes: {
    shape: THREE.Shape
    mesh: THREE.Mesh
    lines: THREE.LineSegments
  }[] = []

  svgGroup.scale.y *= -1
  svgData.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path)

    shapes.forEach((shape) => {
      const meshGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusion,
        bevelEnabled: false
      })
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry)

      const mesh = new THREE.Mesh(meshGeometry, fillMaterial)
      mesh.receiveShadow = receiveShadow
      mesh.castShadow = castShadow

      const lines = new THREE.LineSegments(linesGeometry, stokeMaterial)

      svgShapes.push({
        shape,
        mesh,
        lines
      })
      svgGroup.add(mesh, lines)
    })
  })

  const size = new THREE.Box3()
    .setFromObject(svgGroup)
    .getSize(new THREE.Vector3())
  const xOffset = size.x / -2
  const yOffset = size.y / -2

  // Offset all of group's elements, to center them
  svgGroup.children.forEach((item) => {
    item.position.x = xOffset
    item.position.y = yOffset
  })
  svgGroup.rotateX(-Math.PI / 2)

  const update = (extrusion: number) => {
    svgShapes.forEach(item => {
      const meshGeometry = new THREE.ExtrudeGeometry(
        item.shape,
        {
          depth: extrusion,
          bevelEnabled: false
        }
      )
      const linesGeometry = new THREE.EdgesGeometry(meshGeometry)

      item.mesh.geometry.dispose()
      item.lines.geometry.dispose()
      item.mesh.geometry = meshGeometry
      item.lines.geometry = linesGeometry
    })
  }

  const dispose = () => {
    svgShapes.forEach(item => {
      const mesh = item.mesh
      mesh.clear()
      mesh.removeFromParent()
    })
    svgGroup.clear()
    svgGroup.removeFromParent()
  }

  return {
    svgObj: svgGroup,
    update,
    dispose
  }
}

const SvgMesh = defineComponent({
  name: 'SvgMesh',

  props: {
    svgPath: {
      type: String as PropType<string>,
      required: true
    },
    depth: {
      type: Number as PropType<number>,
      default: 1
    },
    fillMaterial: {
      type: Object as PropType<THREE.Material>,
      required: true
    },
    stokeMaterial: {
      type: Object as PropType<THREE.Material>,
      required: true
    },
    castShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    receiveShadow: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  setup (props) {
    const { svgObj, dispose } = renderSVG({
      extrusion: props.depth,
      svgPath: props.svgPath,
      fillMaterial: props.fillMaterial,
      stokeMaterial: props.stokeMaterial,
      castShadow: props.castShadow,
      receiveShadow: props.receiveShadow
    })

    const container = injectContainer()
    container?.add(svgObj)

    onBeforeUnmount(() => {
      dispose()
    })

    return () => (
      <div class='svg-mesh' />
    )
  }
})

export {
  SvgMesh
}
