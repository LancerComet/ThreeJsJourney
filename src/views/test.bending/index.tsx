import { OrthographicCamera } from 'three'
import { defineComponent } from 'vue'

import { AxesHelper } from '../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../core.v2/lights'
import { useScene } from '../../core.v2/scene'

import image01 from './assets/01.jpg'
import image02 from './assets/02.jpg'
import image03 from './assets/03.jpg'
import image04 from './assets/04.jpg'
import image05 from './assets/05.jpg'
import image06 from './assets/06.jpg'
import image07 from './assets/07.jpg'
import image08 from './assets/08.jpg'
import image09 from './assets/09.jpg'
import image10 from './assets/10.jpg'

import style from './index.module.styl'
import { MangaPage, MangaPageVM } from './manga-page'

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

const imageList = [
  image01,
  image02,
  image03,
  image04,
  image05,
  image06,
  image07,
  image08,
  image09,
  image10
]

const TestBending = defineComponent({
  name: 'TestBending',

  setup () {
    let pageIndex = 0
    const pageCount = 5
    const pageRefs: MangaPageVM[] = []

    const [camera, setCameraSize] = createCamera()
    const { Scene } = useScene({
      useControl: true,
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
      if (pageIndex < pageCount) {
        const vm = pageRefs[pageIndex]
        vm?.flip()
        pageIndex++
      }
    }

    return () => (
      <div>
        <Scene background={0xaaaaaa}>
          <AxesHelper />
          {
            new Array(pageCount).fill('').map((_, index) => {
              const baseIndex = index * 2
              return (
                <MangaPage
                  index={index} totalPage={pageCount}
                  ref={(vm: MangaPageVM) => {
                    pageRefs[index] = vm
                  }}
                  image01={imageList[baseIndex]}
                  image02={imageList[baseIndex + 1]}
                />
              )
            })
          }
        </Scene>

        <div class={style.controlButtons}>
          <button onClick={goPrev}>Go prev</button>
          <button onClick={goNext}>Go next</button>
        </div>
      </div>
    )
  }
})

export {
  TestBending
}
