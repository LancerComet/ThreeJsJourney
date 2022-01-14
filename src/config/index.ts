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
    },
    {
      name: 'Fonts',
      path: 'fonts',
      component: () => import('../views/chapter-01/13.fonts').then(item => item.Fonts)
    }
  ],
  'Chapter 02': [
    {
      name: 'Lights',
      path: 'lights',
      component: () => import('../views/chapter-02/15.lights').then(item => item.Lights)
    }
  ]
}

export {
  pageConfig
}
