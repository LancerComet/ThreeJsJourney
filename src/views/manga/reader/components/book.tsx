import { TextureLoader } from 'three'
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

    const Page = (primary: string, secondary: string) => {
      return (
        <Group rotation={{ x: (-90 / 180) * Math.PI }}>
          {/* Primary. */}
          <Mesh>
            <PlaneGeometry width={width} height={height} />
            <StandardMaterial params={{
              map: new TextureLoader().load(primary)
            }} />
          </Mesh>

          {/* Secondary. */}
          <Mesh rotation={{ y: (-180 / 180) * Math.PI }}>
            <PlaneGeometry width={width} height={height} />
            <StandardMaterial params={{
              map: new TextureLoader().load(secondary)
            }} />
          </Mesh>
        </Group>
      )
    }

    return () => (
      // <Group>{
      //   props.images.map((item, index) => (
      //     <Mesh
      //       position={{ x: width * index }}
      //       rotation={{ x: (-90 / 180) * Math.PI }}
      //       receiveShadow
      //     >
      //       <PlaneGeometry width={width} height={height} />
      //       <StandardMaterial params={{
      //         map: new TextureLoader().load(item)
      //       }} />
      //     </Mesh>
      //   ))
      // }</Group>
      <Group>
        { Page(props.images[0], props.images[1]) }
      </Group>
    )
  }
})

export {
  Book
}
