import { RouteRecordRaw } from 'vue-router'

const pageConfig: { [sectionName: string]: RouteRecordRaw[] } = {
  'Chapter 01': [
    {
      name: 'Texture',
      path: 'texture',
      component: () => import('../views/chapter-01/11.texture').then(item => item.Textures)
    },
    {
      name: 'Material',
      path: 'material',
      component: () => import('../views/chapter-01/12.material').then(item => item.Material)
    }
  ]
}

export {
  pageConfig
}
