import { TextureLoader } from 'three'
import * as THREE from 'three'
import { ComponentPublicInstance, computed, defineComponent, PropType, ref } from 'vue'
import { PlaneGeometry } from '../../../../core.v2/geometries'
import { Group } from '../../../../core.v2/group'
import { StandardMaterial } from '../../../../core.v2/materials'
import { Mesh } from '../../../../core.v2/mesh'

const PAGE_WIDTH = 3
const PAGE_HEIGHT = PAGE_WIDTH * 1.5
const PAGE_GAP = 0.005

const Book = defineComponent({
  name: 'Book',

  props: {
    images: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },

  setup (props, { expose }) {
    const images = props.images || []
    const pageIndexRef = ref(0)
    let inFlipping = false
    const positions: {
      rotateY: number
      positionX: number
    }[] = new Array(images.length).fill({
      rotate: 0
    })

    const createMap = (url: string) => {
      const map = new TextureLoader().load(url)
      map.minFilter = THREE.NearestFilter
      return map
    }

    const goPrev = () => {
      const newIndex = pageIndexRef.value - 1
      if (inFlipping || newIndex < 0) {
        return
      }

      inFlipping = true
      // const position = positions[newIndex]
      // position.positionX = PAGE_WIDTH
      // position.rotateY = (-180 / 180) * Math.PI
      pageIndexRef.value = newIndex
      inFlipping = false
    }

    const goNext = () => {
      const newIndex = pageIndexRef.value + 1
      if (inFlipping || newIndex >= images.length) {
        return
      }

      inFlipping = true
      pageIndexRef.value = newIndex
      inFlipping = false
      console.log('goNext:', newIndex)
    }

    expose({
      goPrev,
      goNext
    })

    const Page = (param: {
      images: [string, string],
      index: number
    }) => {
      const [primary, secondary] = param.images
      const index = param.index
      // const position = positions[index]

      const rotationRef = computed(() => {
        return {
          x: (-90 / 180) * Math.PI,
          y: pageIndexRef.value > index
            ? (-180 / 180) * Math.PI
            : 0
        }
      })

      const positionRef = computed(() => {
        return {
          x: pageIndexRef.value > index
            ? PAGE_WIDTH
            : 0,
          y: (pageIndexRef.value > index
            ? 1
            : -1) * PAGE_GAP * index
        }
      })

      return (
        <Group
          rotation={rotationRef.value}
          position={positionRef.value}
        >
          <Mesh receiveShadow castShadow>
            <PlaneGeometry width={PAGE_WIDTH} height={PAGE_HEIGHT} />
            <StandardMaterial params={{
              map: createMap(primary)
            }} />
          </Mesh>

          <Mesh rotation={{ y: (-180 / 180) * Math.PI }}>
            <PlaneGeometry width={PAGE_WIDTH} height={PAGE_HEIGHT} />
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

type BookVM = ComponentPublicInstance<{
  images: string[]
}, {
  goPrev: () => Promise<void>
  goNext: () => Promise<void>
}>

export {
  Book,
  BookVM
}
