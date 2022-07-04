import { OrthographicCamera, Vector3 } from 'three'
import { defineComponent, ref } from 'vue'

import { AxesHelper } from '../../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../../core.v2/lights'
import { useScene } from '../../../core.v2/scene'

import image01 from './assets/01.jpg'
import image02 from './assets/02.jpg'
import image03 from './assets/03.jpg'
import image04 from './assets/04.jpg'
import image05 from './assets/05.jpg'
import image06 from './assets/06.jpg'
import image07 from './assets/07.jpg'
import image08 from './assets/08.jpg'
import { Book, BookVM } from './components/book'
import style from './index.module.styl'

const createCamera = (): [OrthographicCamera, () => void] => {
  const viewSize = 7
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new OrthographicCamera(
    -aspectRatio * viewSize / 2,
    aspectRatio * viewSize / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1, 1000
  )
  camera.position.set(0, 100, 0)
  camera.lookAt(new Vector3(0, 0, 0))

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
    const [camera, setCameraSize] = createCamera()
    const bookRef = ref<BookVM>()

    const { Scene, controls } = useScene({
      antialias: true,
      useControl: true,
      useShadow: true,
      camera,
      onResize: setCameraSize
    })

    const images = [
      image01, image02, image03, image04,
      image05, image06, image07, image08
    ]

    const goPrev = () => bookRef.value?.goPrev()
    const goNext = () => bookRef.value?.goNext()

    return () => (
      <div class={style.pageContainer}>
        <Scene background={0xeeeeee}>
          <AxesHelper />
          <Book ref={bookRef} images={images} />
          <AmbientLight intensity={0.8} color={0xffffff} />
          <PointLight showHelper position={{ x: 4, y: 3, z: 4 }} intensity={0.5} castShadow />
        </Scene>

        <div class={style.controlButtons}>
          <button onClick={goPrev}>Prev</button>
          <button onClick={goNext}>Next</button>
        </div>
      </div>
    )
  }
})

export {
  MangaReader
}
