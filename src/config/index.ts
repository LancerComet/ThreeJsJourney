import { RouteRecordRaw } from 'vue-router'

const pageConfig: { [sectionName: string]: RouteRecordRaw[] } = {
  'Chapter 01': [
    {
      name: 'Texture',
      path: 'texture',
      component: () => import('../views/chapter-01/texture').then(item => item.Textures)
    }
  ]
}

export {
  pageConfig
}
