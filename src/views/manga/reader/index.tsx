import { OrthographicCamera, Vector3 } from 'three'
import { computed, defineComponent, onMounted, ref } from 'vue'

import { Group } from '../../../core.v2/group'
import { AxesHelper } from '../../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../../core.v2/lights'
import { useScene } from '../../../core.v2/scene'

import blankImage from './assets/blank.png'
import style from './index.module.styl'
import { MangaPage, MangaPageVM } from './manga-page'
import { getEpisodeId, getBlankPageIndex, getMangaImages } from './modules'

const createCamera = (): [OrthographicCamera, () => void] => {
  const viewSize = 8.2
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new OrthographicCamera(
    -aspectRatio * viewSize / 2,
    aspectRatio * viewSize / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1, 1000
  )
  camera.position.set(-40, 60, 180)

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

const MangaReader = defineComponent({
  name: 'MangaReader',

  setup () {
    let pageIndex = 0
    const pageRefs: MangaPageVM[] = []
    const imageUrlsRef = ref<string[]>()
    const imageCount = computed(() => {
      return imageUrlsRef.value?.length ?? 0
    })
    const pageCount = computed(() => {
      return Math.ceil(imageCount.value / 2)
    })

    const [camera, setCameraSize] = createCamera()

    const { Scene, controls } = useScene({
      useGui: false,
      camera,
      onResize: () => {
        setCameraSize()
      }
    })

    // 设置相机默认值必须使用 controls.target.
    if (controls) {
      controls.target = new Vector3(0, 3.4, 0)
    }

    const goPrev = () => {
      if (pageIndex > 0) {
        const vm = pageRefs[pageIndex - 1]
        vm?.backward()
        pageIndex--
      }
    }

    const goNext = () => {
      if (pageIndex < pageCount.value) {
        const vm = pageRefs[pageIndex]
        vm?.flip()
        pageIndex++
      }
    }

    const useExample = () => {
      window.location.href = '/manga/reader?episodeId=702661&addBlank=1'
    }

    const initReaderImages = async () => {
      const episodeId = getEpisodeId()
      if (!episodeId) {
        return
      }
      const imageUrls = await getMangaImages(episodeId)
      if (imageUrls.length) {
        const blankIndex = getBlankPageIndex()
        if (blankIndex > -1) {
          imageUrls.splice(blankIndex, 0, blankImage)
        }
        imageUrls.push(blankImage)
      }
      imageUrlsRef.value = imageUrls
    }

    onMounted(initReaderImages)

    return () => (
      <>
        <Scene background={0xcccccc}>
          <AmbientLight
            intensity={0.7} color={0xA9C9E2}
          />
          <PointLight
            castShadow intensity={0.9} color={0xfff0ba} distance={50}
            position={{ x: 3, y: 10, z: 3 }} showHelper
          />
          <AxesHelper />
          <Group position={{ x: -2.5 }}>{
            new Array(pageCount.value).fill('').map((_, index) => {
              const baseIndex = index * 2
              return (
                <MangaPage
                  index={index}
                  totalPage={pageCount.value}
                  ref={(vm: MangaPageVM) => {
                    pageRefs[index] = vm
                  }}
                  image01={imageUrlsRef.value?.[baseIndex]}
                  image02={imageUrlsRef.value?.[baseIndex + 1]}
                />
              )
            })
          }</Group>
        </Scene>

        <div class={style.controlButtons}>
          <button onClick={goPrev}>Prev page</button>
          <button onClick={goNext}>Next page</button>
          <button onClick={useExample}>Example</button>
        </div>
      </>
    )
  }
})

export {
  MangaReader
}
