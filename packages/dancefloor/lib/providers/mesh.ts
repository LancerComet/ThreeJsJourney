import type { Mesh, Points } from 'three'
import { provide, inject } from 'vue'

const INJECT_KEY = 'three:mesh'

const provideMesh = (mesh: Mesh | Points) => {
  provide(INJECT_KEY, mesh)
}

const injectMesh = () => {
  return inject<Mesh | Points | undefined>(INJECT_KEY, () => {
    console.warn('[Warn] You should use this under a Mesh or Points object.')
    return undefined
  }, true)
}

export {
  provideMesh,
  injectMesh
}
