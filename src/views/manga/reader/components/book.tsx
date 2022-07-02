import { TextureLoader } from 'three'
import * as THREE from 'three'
import { defineComponent, PropType } from 'vue'
import { BoxGeometry, PlaneGeometry } from '../../../../core.v2/geometries'
import { Group } from '../../../../core.v2/group'
import { StandardMaterial } from '../../../../core.v2/materials'
import { Mesh } from '../../../../core.v2/mesh'

const Book = defineComponent({
  name: 'Book',

  props: {
    images: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },

  setup (props) {
    const width = 3
    const height = width * 1.5
    const images = props.images || []

    const createMap = (url: string) => {
      const map = new TextureLoader().load(url)
      map.minFilter = THREE.NearestFilter
      return map
    }

    const Page = (param: {
      images: [string, string],
      index: number
    }) => {
      const [primary, secondary] = param.images
      return (
        <Group
          rotation={{
            x: (-90 / 180) * Math.PI
          }}
          position={{
            y: -0.02 * param.index
          }}
        >
          <Mesh receiveShadow castShadow>
            <PlaneGeometry width={width} height={height} />
            <StandardMaterial params={{
              map: createMap(primary)
            }} />
          </Mesh>

          <Mesh rotation={{ y: (-180 / 180) * Math.PI }}>
            <PlaneGeometry width={width} height={height} />
            <StandardMaterial params={{
              map: createMap(secondary)
            }} />
          </Mesh>
        </Group>
      )
    }

    const imageGroups: [string, string][] = []
    const groupCount = Math.ceil(images.length / 2)
    for (let i = 0; i < groupCount; i++) {
      const primary = images[i * 2] ?? ''
      const secondary = images[i * 2 + 1] ?? ''
      imageGroups.push([primary, secondary])
    }

    return () => (
      <Group>{
        imageGroups.map((item, index) => (
          Page({
            images: item,
            index
          })
        ))
      }</Group>
    )
  }
})

export {
  Book
}
