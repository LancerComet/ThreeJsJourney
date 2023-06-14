import {
  AmbientLight, OrbitControls, PerspectiveCamera, useScene, PointLight,
  Mesh, SphereGeometry, PlaneGeometry, StandardMaterial, TorusGeometry, MatcapMaterial
} from '@lancercomet/dancefloor'
import { BufferAttribute, CubeTextureLoader, DoubleSide, TextureLoader } from 'three'
import { defineComponent, ref } from 'vue'

import { useResize } from '../../hooks/resize'

const Material = defineComponent({
  name: 'Material',
  setup () {
    const { Scene, resize, onTick, clock } = useScene({
    })
    const textureLoader = new TextureLoader()

    const sphereRotationRef = ref({
      x: 0, y: 0, z: 0
    })

    const Sphere = () => (
      <Mesh position={{ x: -1.5 }} rotation={sphereRotationRef.value} >
        <SphereGeometry radius={0.5} widthSegment={64} heightSegment={64} />
        <StandardMaterial
          params={{
            roughness: 0,
            metalness: 0.8,
            envMap: new CubeTextureLoader().load([
              '/textures/environmentMaps/0/px.jpg',
              '/textures/environmentMaps/0/nx.jpg',
              '/textures/environmentMaps/0/py.jpg',
              '/textures/environmentMaps/0/ny.jpg',
              '/textures/environmentMaps/0/pz.jpg',
              '/textures/environmentMaps/0/nz.jpg'
            ])
          }}
        />
      </Mesh>
    )

    const planeRotationRef = ref({
      x: 0, y: 0, z: 0
    })

    const Plane = () => (
      <Mesh rotation={planeRotationRef.value}>
        <PlaneGeometry
          width={1} height={1} widthSegment={100} heightSegment={100}
          onCreated={geometry => {
            geometry.setAttribute('uv2', new BufferAttribute(geometry.attributes.uv.array, 2))
          }}
        />
        <StandardMaterial
          params={{
            map: textureLoader.load('/textures/door/color.jpg'),

            alphaMap: textureLoader.load('/textures/door/alpha.jpg'),
            transparent: true,

            aoMap: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
            aoMapIntensity: 1,

            displacementMap: textureLoader.load('/textures/door/height.jpg'),
            displacementScale: 0.05,

            side: DoubleSide
          }}
        />
      </Mesh>
    )

    const torusRotationRef = ref({
      x: 0, y: 0, z: 0
    })

    const Torus = () => (
      <Mesh position={{ x: 1.5 }} rotation={torusRotationRef.value}>
        <TorusGeometry radius={0.3} tube={0.2} radialSegment={16} tubularSegments={128} />
        <MatcapMaterial params={{
          matcap: textureLoader.load('/textures/matcaps/1.png')
        }} />
      </Mesh>
    )

    onTick(() => {
      const elapsedTime = clock.getElapsedTime()
      sphereRotationRef.value.y = 0.1 * elapsedTime
      planeRotationRef.value.y = 0.1 * elapsedTime
      torusRotationRef.value.y = 0.1 * elapsedTime

      sphereRotationRef.value.x = 0.15 * elapsedTime
      planeRotationRef.value.x = 0.15 * elapsedTime
      torusRotationRef.value.x = 0.15 * elapsedTime
    })

    useResize(() => {
      resize(window.innerWidth, window.innerHeight)
    })

    return () => (
      <Scene background={0xaaaaaa} >
        <PerspectiveCamera position={{ x: 5, y: 5, z: 5 }}>
          <OrbitControls />
        </PerspectiveCamera>

        <AmbientLight color={0xffffff} intensity={0.5} />
        <PointLight color={0xffffff} intensity={0.5} position={{ x: 2, y: 3, z: 4 }} />

        <Sphere />
        <Plane />
        <Torus />
      </Scene>
    )
  }
})

export {
  Material
}
