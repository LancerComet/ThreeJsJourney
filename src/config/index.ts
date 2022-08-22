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
    },
    {
      name: 'Shadow',
      path: 'shadow',
      component: () => import('../views/chapter-02/16.shadow').then(item => item.Shadow)
    },
    {
      name: 'Particles',
      path: 'particles',
      component: () => import('../views/chapter-02/18.particles').then(item => item.Particles)
    },
    {
      name: 'Galaxy',
      path: 'galaxy',
      component: () => import('../views/chapter-02/19.galaxy').then(item => item.Galaxy)
    },
    {
      name: 'RayCaster',
      path: 'ray-caster',
      component: () => import('../views/chapter-02/20.raycaster').then(item => item.RayCasterPage)
    }
  ],

  'Chapter-03': [
    {
      name: 'Physics',
      path: 'physics',
      component: () => import('../views/chapter-03/22.physics').then(item => item.Physics)
    },
    {
      name: 'Realistic Render',
      path: 'realistic-render',
      component: () => import('../views/chapter-03/25.realistic-render').then(item => item.RealisticRender)
    }
  ],

  Manga: [
    {
      name: 'Clean',
      path: 'clean',
      component: () => import('../views/manga/clean/clean').then(item => item.CleanScene)
    },
    {
      name: 'Hub',
      path: 'hub',
      component: () => import('../views/manga/hub').then(item => item.MangaHub)
    },
    {
      name: 'Reader',
      path: 'reader',
      component: () => import('../views/manga/reader').then(item => item.MangaReader)
    }
  ],

  Forest: [
    {
      name: 'Forest',
      path: 'forest',
      component: () => import('../views/forest/index').then(item => item.ForestScene)
    }
  ],

  Test: [
    {
      name: 'Test',
      path: 'test',
      component: () => import('../views/test/index').then(item => item.TestPage)
    }
  ]
}

export {
  pageConfig
}
