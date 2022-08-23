import CameraControls from 'camera-controls'
import * as THREE from 'three'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'

import { Group } from '../../../core.v2/group'
import { AxesHelper } from '../../../core.v2/helpers'
import { AmbientLight, PointLight } from '../../../core.v2/lights'
import { useScene } from '../../../core.v2/scene'
import { ActionBar } from './components/action-bar'
import { MangaPage, MangaPageVM } from './components/manga-reader'
import { usePointerControl } from './hooks/pointer-control'
import style from './index.module.styl'
import { CubicBezier } from './modules/cubic-bezier'
import { getFps } from './modules/fps'
import { InteractionManager } from './modules/interactive'
import { useMangaImages } from './modules/manga'
import { IEpisodeOption } from './types'
import { clampNumber, sleep } from './utils'

const isProd = process.env.NODE_ENV === 'production'
const cubicBezier = new CubicBezier(0.22, 0.58, 0.12, 0.98)

const EXAMPLE_EPISODES: IEpisodeOption[] = [
  { id: 702661, blank: 1, label: '缘结甘神家' },
  { id: 628054, blank: 1, label: '杜鹃的婚约' },
  { id: 482133, blank: -1, label: 'Kisekoi' },
  { id: 463667, blank: 1, label: 'Spy & Family' },
  { id: 448067, blank: -1, label: '她他' },
  { id: 658076, blank: 1, label: 'ShioAma' },
  { id: 488720, blank: -1, label: 'TomoKawa' },
  { id: 503807, blank: -1, label: 'OchiFuru' },
  { id: 585961, blank: -1, label: 'Blend S' }
]

const createCamera = (): [THREE.OrthographicCamera, () => void] => {
  const viewSize = 8.2
  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.OrthographicCamera(
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
    const releasedColor = 0.4
    const lockedColor = 0.18
    const colorObject = new THREE.Color().setHSL(0, 0, releasedColor)
    const backgroundRef = ref(colorObject.getHex())

    // pageIndex 指的是纸张的下标, 不是逻辑页码.
    let pageIndex = 0
    let isCameraLocked = false

    // MangaPage 组件引用列表.
    // 列表将在组件的 ref 函数中进行赋值.
    let pageComponentRefs: MangaPageVM[] = []
    const selectedOptionRef = ref(0)
    const episodeData = computed(() => {
      const index = selectedOptionRef.value ?? 0
      return EXAMPLE_EPISODES[index]
    })

    const {
      imageUrlsRef, pageCount,
      mutate: loadEpisodeImages
    } = useMangaImages()

    const [camera, setCameraSize] = createCamera()
    const { Scene, renderer, clock, onTick } = useScene({
      camera,
      useControl: false,
      antialias: true,
      onResize: () => {
        setCameraSize()
      }
    })

    const controls = new CameraControls(camera, renderer.domElement)
    controls.dampingFactor = 0.07
    // controls.dollySpeed = 0.5 // MouseWheel speed.
    controls.azimuthRotateSpeed = 0.35
    controls.polarRotateSpeed = 0.35
    controls.enabled = true
    controls.moveTo(0, 3.4, 0)

    const interactionManager = new InteractionManager({
      renderer,
      camera,
      domElement: renderer.domElement,
      usePointerEvents: true
    })

    onTick(() => {
      controls.update(clock.getDelta())
      interactionManager.update()
    })

    const goPrev = () => {
      if (pageIndex > 0) {
        const vm = pageComponentRefs[pageIndex - 1]
        vm?.backward()
        pageIndex--
      }
    }

    const goNext = () => {
      if (pageIndex < pageCount.value) {
        const vm = pageComponentRefs[pageIndex]
        vm?.flip()
        pageIndex++
      }
    }

    const pageFlipDistance = 60
    let inFlipping = false

    const toStart = async () => {
      if (inFlipping) {
        return
      }
      inFlipping = true
      await Promise.all(
        pageComponentRefs.slice()
          .reverse()
          .filter(vm => vm.getFlipPercent() > 0)
          .map(async (vm, index) => {
            await sleep(index * pageFlipDistance)
            return vm.backward()
          })
      )
      pageIndex = 0
      inFlipping = false
    }

    const toEnd = async () => {
      if (inFlipping) {
        return
      }

      inFlipping = true
      await Promise.all(
        pageComponentRefs
          .filter(vm => vm.getFlipPercent() < 1)
          .map(async (vm, index) => {
            await sleep(index * pageFlipDistance)
            return vm.flip()
          })
      )
      pageIndex = pageCount.value
      inFlipping = false
    }

    const resetState = () => {
      pageComponentRefs = []
      pageIndex = 0
    }

    const selectEpisode = async (index: number) => {
      resetState()

      selectedOptionRef.value = index

      const { id, blank } = episodeData.value
      await loadEpisodeImages(id, blank)
      setManualFlipEnableState()
    }

    const setManualFlipEnableState = () => {
      setPointerControlEnable(isCameraLocked)
    }

    const lockCamera = () => {
      if (isCameraLocked) {
        return
      }

      const y = 3.35
      controls.setLookAt(0, y, 50, 0, y, 0, true)
      controls.zoomTo(1.1, true)
      controls.enabled = false
      isCameraLocked = true
      setManualFlipEnableState()

      cubicBezier.tick(releasedColor, lockedColor, getFps(), (t) => {
        backgroundRef.value = colorObject.setHSL(0, 0, t).getHex()
      })
    }

    const releaseCamera = () => {
      if (!isCameraLocked) {
        return
      }

      controls.setLookAt(-150, 100, 180, 0, 3, 0, true)
      controls.enabled = true
      isCameraLocked = false
      setManualFlipEnableState()
      cubicBezier.tick(lockedColor, releasedColor, getFps(), (t) => {
        backgroundRef.value = colorObject.setHSL(0, 0, t).getHex()
      })
    }

    const globalKeyHandler = (event: KeyboardEvent) => {
      const key = event.key
      switch (key) {
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
        case 'Home':
          toStart()
          break
        case 'End':
          toEnd()
          break
      }
    }

    const mouseWheelHandler = (event: WheelEvent) => {
      if (!isCameraLocked) {
        return
      }
      const { deltaY } = event
      if (deltaY < 0) {
        goPrev()
      } else {
        goNext()
      }
    }

    window.addEventListener('keyup', globalKeyHandler)
    window.addEventListener('wheel', mouseWheelHandler)

    const {
      dispose: disposePointerControl,
      setEnabled: setPointerControlEnable
    } = usePointerControl({
      moveTotalDistance: clampNumber(150, 800, window.innerWidth * 0.4),
      getIndex: () => pageIndex,
      getMangaPageVms: () => pageComponentRefs.slice(),
      onFlip: (index) => {
        console.log('onManualFlip', index)
        pageIndex = index + 1
      },
      onBackward: (index) => {
        console.log('onManualBackward', index)
        pageIndex = index
      }
    })

    onMounted(async () => {
      await selectEpisode(0)
    })

    onBeforeUnmount(() => {
      disposePointerControl()
      interactionManager.dispose()
      window.removeEventListener('keyup', globalKeyHandler)
      window.removeEventListener('wheel', mouseWheelHandler)
    })

    return () => (
      <>
        <Scene background={backgroundRef.value}>
          <AmbientLight intensity={0.2} color={0xffffff} />
          <PointLight
            castShadow intensity={0.09} color={0xffffff} distance={80}
            position={{ x: -3, y: 4, z: 5 }}
            showHelper={!isProd}
          />
          <PointLight
            castShadow intensity={0.09} color={0xffffff} distance={80}
            position={{ x: 3, y: 4, z: 5 }}
            showHelper={!isProd}
          />
          <PointLight
            castShadow intensity={0.09} color={0xffffff} distance={80}
            position={{ x: -3, y: 4, z: -5 }}
            showHelper={!isProd}
          />
          <PointLight
            castShadow intensity={0.09} color={0xffffff} distance={80}
            position={{ x: 3, y: 4, z: -5 }}
            showHelper={!isProd}
          />
          { isProd ? undefined : <AxesHelper /> }
          <Group position={{ x: -2.5 }}>{
            new Array(pageCount.value).fill('').map((_, index) => {
              const baseIndex = index * 2
              return (
                <MangaPage
                  key={`${episodeData.value?.id ?? 0}-${index}`}
                  ref={(vm: unknown) => {
                    if (vm) {
                      pageComponentRefs[index] = vm as MangaPageVM
                    }
                  }}
                  index={index}
                  totalPage={pageCount.value}
                  image01={imageUrlsRef.value?.[baseIndex]}
                  image02={imageUrlsRef.value?.[baseIndex + 1]}
                  interactionManager={interactionManager}
                />
              )
            })
          }</Group>
        </Scene>

        <ActionBar
          class={style.controlButtons}
          onGoPrev={goPrev} onGoNext={goNext}
          onToTheStart={toStart} onToTheEnd={toEnd}
          onSelectEpisode={selectEpisode}
          onLockCamera={lockCamera} onReleaseCamera={releaseCamera}
          episodeList={EXAMPLE_EPISODES}
        />
      </>
    )
  }
})

export {
  MangaReader
}
