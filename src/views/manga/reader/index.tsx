import { OrthographicCamera } from 'three'
import { computed, defineComponent, onMounted, ref } from 'vue'

import { Group } from '../../../core.v2/group'
import { AxesHelper } from '../../../core.v2/helpers'
import { useScene } from '../../../core.v2/scene'

import blankImage from './assets/blank.png'
import style from './index.module.styl'
import { MangaPage, MangaPageVM } from './manga-page'
import { getEpisodeId, getBlankPageIndex, getMangaImages } from './modules'

const createCamera = (): [OrthographicCamera, () => void] => {
  const viewSize = 8
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
    const { Scene } = useScene({
      useControl: true,
      useGui: false,
      camera,
      onResize: () => {
        setCameraSize()
      }
    })

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

    const useExample = () => {
      window.location.href = '/manga/reader?episodeId=702661&addBlank=1'
    }

    return () => (
      <div>
        <Scene background={0xaaaaaa}>
          <AxesHelper />
          <Group position={{
            x: -2.5
          }}>{
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
          <button onClick={goPrev}>Go prev</button>
          <button onClick={goNext}>Go next</button>
          <button onClick={useExample}>Example</button>
        </div>
      </div>
    )
  }
})

export {
  MangaReader
}
