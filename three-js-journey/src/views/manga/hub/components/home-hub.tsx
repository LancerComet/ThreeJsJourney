import {
  AxesHelper,
  BasicMaterial,
  BoxGeometry,
  Group,
  Mesh,
  PlaneGeometry,
  PointLight,
  StandardMaterial,
  TextGeometry
} from '@lancercomet/dancefloor'
import * as THREE from 'three'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { useCannon } from '../../../../modules/cannon'
import { MangaSeason } from '../model/manga-season'
import { getRecommendationList } from '../services/recommendation'

const HOME_CARD_WIDTH = 4
const HOME_CARD_HEIGHT = 7
const HOME_CARD_THICK = 1
const HOME_CARD_MARGIN = 0.1

const HOME_CARD_COVER_WIDTH = HOME_CARD_WIDTH
const HOME_CARD_COVER_HEIGHT = HOME_CARD_COVER_WIDTH * 1.4

const HomeCard = defineComponent({
  props: {
    seasonData: {
      type: Object as PropType<MangaSeason>,
      default: () => new MangaSeason(),
      required: true
    },

    index: {
      type: Number as PropType<number>,
      default: 0,
      required: true
    }
  },

  emits: ['meshUpdate'],

  setup (props, { emit }) {
    const seasonData = props.seasonData

    const positionRef = computed(() => {
      return {
        x: (HOME_CARD_WIDTH / 2) + props.index * (HOME_CARD_WIDTH + HOME_CARD_MARGIN),
        y: HOME_CARD_HEIGHT / 2 + 5,
        z: HOME_CARD_THICK / 2 + 1
      }
    })

    const CardBody = () => (
      <Mesh castShadow receiveShadow>
        <BoxGeometry width={HOME_CARD_WIDTH} height={HOME_CARD_HEIGHT} depth={HOME_CARD_THICK} />
        <StandardMaterial params={{
          color: 0xeeeeee
        }} />
      </Mesh>
    )

    const Cover = () => {
      const textureLoader = new THREE.TextureLoader()
      const coverMap = textureLoader.load(seasonData.verticalCover)
      coverMap.minFilter = THREE.NearestMipmapLinearFilter

      return (
        <Mesh
          receiveShadow
          position={{
            x: 0,
            y: (HOME_CARD_HEIGHT - HOME_CARD_COVER_HEIGHT) * 0.50,
            z: (HOME_CARD_THICK * 0.5) + 0.01
          }}
        >
          <PlaneGeometry width={HOME_CARD_COVER_WIDTH} height={HOME_CARD_COVER_HEIGHT} />
          <StandardMaterial params={{
            map: coverMap,
            transparent: true
          }} />
        </Mesh>
      )
    }

    const TextSection = () => (
      <Mesh
        position={{
          y: HOME_CARD_COVER_HEIGHT * -0.5,
          z: (HOME_CARD_THICK * 0.5) + 0.01
        }}
      >
        <PlaneGeometry
          width={HOME_CARD_WIDTH}
          height={HOME_CARD_HEIGHT - HOME_CARD_COVER_HEIGHT}
        />
        <StandardMaterial params={{
          color: 0
        }} />
      </Mesh>
    )

    return () => (
      <Group position={positionRef.value} onMounted={mesh => emit('meshUpdate', mesh)}>
        <CardBody />
        <Cover />
        <TextSection />
      </Group>
    )
  }
})

const HomeHub = defineComponent({
  setup () {
    const fontRef = ref<Font>()
    const seasonListRef = ref<MangaSeason[]>([])

    const loadKenPixelFont = async () => {
      const fontLoader = new FontLoader()
      fontRef.value = await fontLoader.loadAsync('/fonts/kenpixel.json') as Font
    }

    const getSeasonList = async () => {
      const data = await getRecommendationList()
      seasonListRef.value = data
    }

    onMounted(async () => {
      await Promise.all([
        loadKenPixelFont(),
        getSeasonList()
      ])
    })

    const Title = () => (
      <Mesh castShadow position={{ z: 4 }}>
        <TextGeometry text='Manga' font={fontRef.value} size={0.5} height={0.2} />
        <BasicMaterial params={{ color: 0x222222 }} />
      </Mesh>
    )

    const { cannonWorld, stepCannonWorld, addObject } = useCannon()

    const tickWorld = () => {
      stepCannonWorld()
      requestAnimationFrame(tickWorld)
    }

    tickWorld()

    const onCardUpdate = (mesh: THREE.Mesh) => {
      console.log('card update:', mesh)
      addObject({
        model: mesh,
        mass: 1
      })
    }

    return () => (
      <Group>
        <PointLight
          color={0xdce7ec} intensity={0.2}
          position={{ x: -20, y: 20, z: 20 }}
          showHelper
          shadowSize={512} castShadow
        />
        <PointLight
          color={0xdce7ec} intensity={0.3}
          position={{ x: 6, y: 6, z: 6 }}
          showHelper
          shadowSize={512} castShadow
        />
        {
          seasonListRef.value.map((item, index) => {
            console.log(index)
            return (
              <HomeCard seasonData={item as MangaSeason} index={index} onMeshUpdate={onCardUpdate} />
            )
          })
        }
        <AxesHelper />
        <Title />
      </Group>
    )
  }
})
export {
  HomeHub
}
